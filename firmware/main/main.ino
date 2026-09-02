#include <WiFi.h>
#include <PubSubClient.h>

// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// MQTT Configuration
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_username = ""; // If needed
const char* mqtt_password = ""; // If needed
const char* hive_id = "HIVE_001";
const char* topic = "hivechain/HIVE_001/telemetry";

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
#define MSG_INTERVAL 5000

// Sensor variables (Mock reading pins/logic)
float temperature = 0.0;
float humidity = 0.0;
float weight = 0.0;
float sound = 0.0;

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
    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void readSensors() {
  // In a real scenario, this would interface with DHT22, HX711, etc.
  // For the actual physical setup, you MUST integrate actual library read calls here.
  // We leave placeholders for hardware values.
  temperature = 34.5 + random(-10, 10) / 10.0; 
  humidity = 55.0 + random(-50, 50) / 10.0;
  weight = 18.5;
  sound = 40.0 + random(-20, 20) / 10.0;
}

void setup() {
  Serial.begin(115200);
  randomSeed(analogRead(0));
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > MSG_INTERVAL) {
    lastMsg = now;
    readSensors();
    
    // Construct JSON String manually or use ArduinoJson
    String payload = "{";
    payload += "\"hive_id\":\"" + String(hive_id) + "\",";
    payload += "\"timestamp\":\"" + String("2026-09-02T12:00:00Z") + "\","; // Replace with NTP time in production
    payload += "\"temperature_c\":" + String(temperature) + ",";
    payload += "\"humidity_pct\":" + String(humidity) + ",";
    payload += "\"weight_kg\":" + String(weight) + ",";
    payload += "\"sound_level_db\":" + String(sound);
    payload += "}";

    Serial.print("Publishing message: ");
    Serial.println(payload);
    client.publish(topic, payload.c_str());
  }
}
