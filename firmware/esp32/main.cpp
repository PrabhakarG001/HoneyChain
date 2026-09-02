#include <WiFi.h>
#include <PubSubClient.h>
#include <time.h>

// --- Configuration ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "YOUR_MQTT_BROKER_IP";
const int mqtt_port = 1883;
String hive_id = "HV-UP-001";

// --- Modes ---
// Uncomment the line below if physical sensors are not attached
// #define SIMULATOR_MODE 1

#ifndef SIMULATOR_MODE
#include "DHT.h"
#include "HX711.h"

// Define Pins
#define DHTPIN 4
#define DHTTYPE DHT22
#define LOADCELL_DOUT_PIN 16
#define LOADCELL_SCK_PIN 17

DHT dht(DHTPIN, DHTTYPE);
HX711 scale;
#endif

WiFiClient espClient;
PubSubClient client(espClient);

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

  Serial.println("\nWiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void setup_ntp() {
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  Serial.print("Waiting for NTP time sync: ");
  time_t now = time(nullptr);
  while (now < 8 * 3600 * 2) {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println("\nTime synchronized.");
}

String get_iso_timestamp() {
  time_t now = time(nullptr);
  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
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
  setup_ntp();
  client.setServer(mqtt_server, mqtt_port);
  
#ifndef SIMULATOR_MODE
  dht.begin();
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(2280.f); // Adjust scale calibration factor
  scale.tare(); // Reset scale to 0
#endif
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  float t = 0.0;
  float h = 0.0;
  float w = 0.0;
  float db = 0.0;
  bool is_simulated = false;

#ifdef SIMULATOR_MODE
  is_simulated = true;
  t = random(300, 400) / 10.0; // 30.0 - 40.0 C
  h = random(400, 600) / 10.0; // 40.0 - 60.0 %
  w = random(400, 500) / 10.0; // 40.0 - 50.0 kg
  db = random(350, 450) / 10.0; // 35.0 - 45.0 dB
#else
  t = dht.readTemperature();
  h = dht.readHumidity();
  if (isnan(t) || isnan(h)) {
    Serial.println("Failed to read from DHT sensor!");
    t = 0.0; h = 0.0;
  }
  
  if (scale.is_ready()) {
    w = scale.get_units(10);
  } else {
    Serial.println("HX711 not found.");
    w = 0.0;
  }
  // Microphone parsing omitted for brevity
#endif

  String payload = "{";
  payload += "\"hive_id\":\"" + hive_id + "\",";
  payload += "\"temperature_c\":" + String(t) + ",";
  payload += "\"humidity_pct\":" + String(h) + ",";
  payload += "\"weight_kg\":" + String(w) + ",";
  payload += "\"sound_level_db\":" + String(db) + ",";
  payload += "\"is_simulated\":" + String(is_simulated ? "true" : "false") + ",";
  payload += "\"timestamp\":\"" + get_iso_timestamp() + "\"";
  payload += "}";

  String topic = "hivechain/" + hive_id + "/telemetry";
  client.publish(topic.c_str(), payload.c_str());
  
  Serial.println("Published: " + payload);
  delay(10000);
}
