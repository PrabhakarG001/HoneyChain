#include <WiFi.h>
#include <PubSubClient.h>
#include <time.h>
#include <SPIFFS.h>

// --- Configuration ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "YOUR_MQTT_BROKER_IP";
const int mqtt_port = 1883;
String hive_id = "HV-UP-001";

// Power & Pin Configuration
#define DEEP_SLEEP_ENABLED 0
#define SLEEP_TIME_SECONDS 60
#define BATTERY_ADC_PIN 34  // TP4056 Battery Level ADC Input Pin
#define GPS_RX_PIN 16       // NEO-6M GPS RX Pin
#define GPS_TX_PIN 17       // NEO-6M GPS TX Pin

// SPIFFS Offline Buffer Settings
#define BUFFER_FILE "/telemetry_queue.json"
#define MAX_BUFFER_ITEMS 500

// --- Modes ---
// Uncomment the line below if physical sensors are not attached
// #define SIMULATOR_MODE 1

#ifndef SIMULATOR_MODE
#include "DHT.h"
#include "HX711.h"

// Define Sensor Pins
#define DHTPIN 4
#define DHTTYPE DHT22
#define LOADCELL_DOUT_PIN 16
#define LOADCELL_SCK_PIN 17

DHT dht(DHTPIN, DHTTYPE);
HX711 scale;
#endif

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastReconnectAttempt = 0;
bool spiffs_initialized = false;

// Initialize SPIFFS File System
void setup_spiffs() {
  if (SPIFFS.begin(true)) {
    spiffs_initialized = true;
    Serial.println("SPIFFS File System Initialized successfully.");
  } else {
    Serial.println("SPIFFS Initialization Failed!");
  }
}

// Store unsent telemetry payload to SPIFFS flash buffer during offline periods
void buffer_telemetry_spiffs(String payload) {
  if (!spiffs_initialized) return;
  
  File file = SPIFFS.open(BUFFER_FILE, FILE_APPEND);
  if (file) {
    file.println(payload);
    file.close();
    Serial.println("Offline telemetry payload saved to SPIFFS buffer.");
  } else {
    Serial.println("Failed to open SPIFFS buffer file for writing.");
  }
}

// Flush buffered telemetry payloads to MQTT once network connectivity is restored
void flush_spiffs_buffer() {
  if (!spiffs_initialized || !client.connected()) return;
  if (!SPIFFS.exists(BUFFER_FILE)) return;
  
  File file = SPIFFS.open(BUFFER_FILE, FILE_READ);
  if (!file) return;

  Serial.println("Flushing offline SPIFFS telemetry buffer to MQTT broker...");
  String topic = "hivechain/" + hive_id + "/telemetry";
  int count = 0;

  while (file.available()) {
    String line = file.readStringUntil('\n');
    line.trim();
    if (line.length() > 0) {
      client.publish(topic.c_str(), line.c_str());
      count++;
      delay(50); // Prevent MQTT socket congestion
    }
  }
  file.close();
  SPIFFS.remove(BUFFER_FILE); // Clear flushed buffer file
  Serial.println("Successfully flushed " + String(count) + " buffered items from SPIFFS.");
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    flush_spiffs_buffer(); // Attempt buffer flush on successful reconnection
  } else {
    Serial.println("\nWiFi connection failed. Retrying in background...");
  }
}

void setup_ntp() {
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  Serial.print("Waiting for NTP time sync: ");
  time_t now = time(nullptr);
  int attempts = 0;
  while (now < 8 * 3600 * 2 && attempts < 10) {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
    attempts++;
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

// Read TP4056 Solar Battery Voltage Percentage (ADC Pin 34)
float read_battery_percentage() {
  int raw_adc = analogRead(BATTERY_ADC_PIN);
  float voltage = (raw_adc / 4095.0) * 3.3 * 2.0; // Voltage divider scaling factor
  float pct = ((voltage - 3.2) / (4.2 - 3.2)) * 100.0; // 3.2V min, 4.2V max
  if (pct > 100.0) pct = 100.0;
  if (pct < 0.0) pct = 0.0;
  return pct;
}

bool reconnect_mqtt() {
  if (client.connected()) return true;
  
  Serial.print("Attempting MQTT connection to ");
  Serial.println(mqtt_server);
  
  if (client.connect(hive_id.c_str())) {
    Serial.println("MQTT connected!");
    String topic = "hivechain/" + hive_id + "/cmd";
    client.subscribe(topic.c_str());
    flush_spiffs_buffer(); // Flush offline telemetry queue
    return true;
  } else {
    Serial.print("MQTT connection failed, rc=");
    Serial.println(client.state());
    return false;
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(BATTERY_ADC_PIN, INPUT);
  setup_spiffs();
  setup_wifi();
  setup_ntp();
  client.setServer(mqtt_server, mqtt_port);
  
#ifndef SIMULATOR_MODE
  dht.begin();
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(2280.f); // Calibration factor
  scale.tare();            // Tare weight to zero
#endif
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    setup_wifi();
  }

  unsigned long now_ms = millis();
  if (!client.connected()) {
    if (now_ms - lastReconnectAttempt > 5000) {
      lastReconnectAttempt = now_ms;
      if (reconnect_mqtt()) {
        lastReconnectAttempt = 0;
      }
    }
  } else {
    client.loop();
  }

  float t = 0.0;
  float h = 0.0;
  float w = 0.0;
  float db = 0.0;
  float bat_pct = 95.0;
  float lat = 26.8467; // Default apiary latitude
  float lng = 80.9462; // Default apiary longitude
  bool is_simulated = false;

#ifdef SIMULATOR_MODE
  is_simulated = true;
  t = random(300, 400) / 10.0; // 30.0 - 40.0 C
  h = random(400, 600) / 10.0; // 40.0 - 60.0 %
  w = random(400, 500) / 10.0; // 40.0 - 50.0 kg
  db = random(350, 450) / 10.0; // 35.0 - 45.0 dB
  bat_pct = random(850, 1000) / 10.0;
#else
  t = dht.readTemperature();
  h = dht.readHumidity();
  if (isnan(t) || isnan(h)) {
    Serial.println("Failed to read from DHT sensor!");
    t = 35.0; h = 50.0;
  }
  
  if (scale.is_ready()) {
    w = scale.get_units(10);
  } else {
    Serial.println("HX711 not ready.");
    w = 0.0;
  }
  db = 40.0; // Ambient acoustic level fallback
  bat_pct = read_battery_percentage();
#endif

  String payload = "{";
  payload += "\"hive_id\":\"" + hive_id + "\",";
  payload += "\"temperature_c\":" + String(t) + ",";
  payload += "\"humidity_pct\":" + String(h) + ",";
  payload += "\"weight_kg\":" + String(w) + ",";
  payload += "\"sound_level_db\":" + String(db) + ",";
  payload += "\"battery_pct\":" + String(bat_pct) + ",";
  payload += "\"lat\":" + String(lat, 4) + ",";
  payload += "\"lng\":" + String(lng, 4) + ",";
  payload += "\"is_simulated\":" + String(is_simulated ? "true" : "false") + ",";
  payload += "\"timestamp\":\"" + get_iso_timestamp() + "\"";
  payload += "}";

  String topic = "hivechain/" + hive_id + "/telemetry";
  if (client.connected()) {
    client.publish(topic.c_str(), payload.c_str());
    Serial.println("Published payload: " + payload);
  } else {
    // Buffer payload locally to SPIFFS when MQTT is disconnected
    buffer_telemetry_spiffs(payload);
  }

#if DEEP_SLEEP_ENABLED
  Serial.println("Entering deep sleep for " + String(SLEEP_TIME_SECONDS) + " seconds...");
  esp_sleep_enable_timer_wakeup(SLEEP_TIME_SECONDS * 1000000ULL);
  esp_deep_sleep_start();
#else
  delay(10000);
#endif
}

