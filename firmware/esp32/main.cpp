#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

const char* mqtt_server = "YOUR_MQTT_BROKER_IP";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

String hive_id = "HV-UP-001";

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(hive_id.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  
  // Initialize sensors here (e.g. DHT22, HX711)
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Read sensors here (this is where real data comes from)
  // float t = dht.readTemperature();
  // float h = dht.readHumidity();
  // float w = scale.get_units(10);
  
  // Simulated readings for compilation check only - REPLACE with real sensor readings
  float t = 35.0; 
  float h = 50.0;
  float w = 45.0;
  float db = 40.0;

  String payload = "{";
  payload += "\"hive_id\":\"" + hive_id + "\",";
  payload += "\"temperature_c\":" + String(t) + ",";
  payload += "\"humidity_pct\":" + String(h) + ",";
  payload += "\"weight_kg\":" + String(w) + ",";
  payload += "\"sound_level_db\":" + String(db) + ",";
  payload += "\"timestamp\":\"2026-09-02T15:30:00Z\""; // Note: Use NTP client for real time
  payload += "}";

  String topic = "hivechain/" + hive_id + "/telemetry";
  client.publish(topic.c_str(), payload.c_str());
  
  Serial.println("Published: " + payload);
  
  delay(10000); // Publish every 10 seconds
}
