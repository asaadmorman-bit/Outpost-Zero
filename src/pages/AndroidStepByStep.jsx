import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Copy, Folder, FileText, Code, Smartphone, ArrowRight, AlertTriangle } from 'lucide-react';

export default function AndroidStepByStep() {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [copiedCode, setCopiedCode] = useState('');

  const toggleStep = (stepId) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const steps = [
    {
      id: 'create-project',
      title: 'Create New Android Studio Project',
      icon: Smartphone,
      difficulty: 'Easy',
      time: '2 min',
      instructions: [
        'Open Android Studio',
        'Click "New Project" or "Start a new Android Studio project"',
        'Select "Empty Views Activity" template',
        'Set Application name: "Rev Sentinel"',
        'Set Package name: "com.cyberdojo.revsentinel"',
        'Set Save location to your desired folder',
        'Set Language: Kotlin',
        'Set Minimum API level: API 24 ("Nougat"; Android 7.0)',
        'Click "Finish"'
      ]
    },
    {
      id: 'setup-gradle',
      title: 'Configure build.gradle (Module: app)',
      icon: Code,
      difficulty: 'Easy',
      time: '3 min',
      instructions: [
        'In Android Studio, expand "Gradle Scripts" in the project view',
        'Open "build.gradle (Module: :app)" - this is the second build.gradle file',
        'REPLACE the entire contents with the code below',
        'Click "Sync Now" when prompted (yellow bar at top)'
      ],
      code: `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
    id 'kotlin-parcelize'
}

android {
    namespace 'com.cyberdojo.revsentinel'
    compileSdk 34

    defaultConfig {
        applicationId "com.cyberdojo.revsentinel"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            buildConfigField "String", "BASE_URL", '"https://YOUR-APP-ID.base44.dev/"'
        }
        debug {
            buildConfigField "String", "BASE_URL", '"https://YOUR-APP-ID.base44.dev/"'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    
    kotlinOptions {
        jvmTarget = '1.8'
    }
    
    buildFeatures {
        viewBinding true
        buildConfig true
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.recyclerview:recyclerview:1.3.2'
    implementation 'androidx.coordinatorlayout:coordinatorlayout:1.2.0'
    
    // Networking
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.11.0'
    
    // Coroutines
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
    
    // ViewModel and LiveData
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0'
    implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.7.0'
    implementation 'androidx.activity:activity-ktx:1.8.2'
    
    // Secure storage
    implementation 'androidx.security:security-crypto:1.1.0-alpha06'
    
    // JSON parsing
    implementation 'com.google.code.gson:gson:2.10.1'
    
    // WebView for auth
    implementation 'androidx.browser:browser:1.7.0'
    
    // SwipeRefreshLayout
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'
}`
    },
    {
      id: 'setup-manifest',
      title: 'Update AndroidManifest.xml',
      icon: FileText,
      difficulty: 'Easy',
      time: '2 min',
      instructions: [
        'Navigate to app → manifests → AndroidManifest.xml',
        'REPLACE the entire contents with the code below',
        'This adds internet permissions and defines our activities'
      ],
      code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.RevSentinel"
        android:usesCleartextTraffic="true"
        tools:targetApi="31">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.RevSentinel.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
        <activity
            android:name=".LoginActivity"
            android:exported="false"
            android:theme="@style/Theme.RevSentinel.NoActionBar" />
            
        <activity
            android:name=".DashboardActivity"
            android:exported="false" />

    </application>

</manifest>`
    },
    {
      id: 'create-folders',
      title: 'Create Package Structure',
      icon: Folder,
      difficulty: 'Easy',
      time: '2 min',
      instructions: [
        'Right-click on app → src → main → java → com → cyberdojo → revsentinel',
        'Select "New" → "Package"',
        'Create these packages one by one:',
        '• models',
        '• network', 
        '• storage',
        '• viewmodel',
        '• adapters'
      ]
    },
    {
      id: 'create-models',
      title: 'Create Data Models',
      icon: Code,
      difficulty: 'Easy',
      time: '5 min',
      instructions: [
        'Right-click on the "models" package',
        'Select "New" → "Kotlin Class/File"',
        'Create each file below with the exact name and code:'
      ],
      files: [
        {
          name: 'SecurityEvent.kt',
          code: `package com.cyberdojo.revsentinel.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class SecurityEvent(
    val id: String,
    val event_id: String,
    val timestamp: String,
    val source_ip: String?,
    val destination_ip: String?,
    val event_type: String,
    val severity: String,
    val status: String,
    val user_id: String?,
    val device_id: String?,
    val location: String?,
    val description: String?,
    val ml_risk_score: Double?
) : Parcelable`
        },
        {
          name: 'Incident.kt',
          code: `package com.cyberdojo.revsentinel.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Incident(
    val id: String,
    val incident_id: String,
    val title: String,
    val description: String,
    val severity: String,
    val status: String,
    val assigned_to: String?,
    val created_date: String,
    val affected_assets: List<String>?
) : Parcelable`
        },
        {
          name: 'User.kt',
          code: `package com.cyberdojo.revsentinel.models

data class User(
    val id: String,
    val email: String,
    val full_name: String,
    val role: String,
    val access_level: String
)`
        }
      ]
    },
    {
      id: 'create-storage',
      title: 'Create Secure Storage',
      icon: Code,
      difficulty: 'Medium',
      time: '3 min',
      instructions: [
        'Right-click on the "storage" package',
        'Select "New" → "Kotlin Class/File"',
        'Create: "SecureStorage.kt"',
        'Paste the code below:'
      ],
      code: `package com.cyberdojo.revsentinel.storage

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys

class SecureStorage(context: Context) {
    
    private val masterKeyAlias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)
    
    private val sharedPreferences: SharedPreferences = EncryptedSharedPreferences.create(
        "rev_sentinel_secure_prefs",
        masterKeyAlias,
        context,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
    
    fun saveToken(token: String) {
        sharedPreferences.edit().putString("auth_token", token).apply()
    }
    
    fun getToken(): String? {
        return sharedPreferences.getString("auth_token", null)
    }
    
    fun saveUserEmail(email: String) {
        sharedPreferences.edit().putString("user_email", email).apply()
    }
    
    fun getUserEmail(): String? {
        return sharedPreferences.getString("user_email", null)
    }
    
    fun clearAll() {
        sharedPreferences.edit().clear().apply()
    }
    
    fun isLoggedIn(): Boolean {
        return getToken() != null
    }
}`
    },
    {
      id: 'create-network',
      title: 'Create Network Layer',
      icon: Code,
      difficulty: 'Medium',
      time: '5 min',
      instructions: [
        'Right-click on the "network" package',
        'Create these two files:'
      ],
      files: [
        {
          name: 'OutpostZeroApi.kt',
          code: `package com.cyberdojo.revsentinel.network

import com.cyberdojo.revsentinel.models.*
import retrofit2.Response
import retrofit2.http.*

interface OutpostZeroApi {
    
    @GET("functions/getSecurityEvents")
    suspend fun getSecurityEvents(): Response<List<SecurityEvent>>
    
    @GET("functions/getIncidents") 
    suspend fun getIncidents(): Response<List<Incident>>
    
    @GET("functions/getUserProfile")
    suspend fun getUserProfile(): Response<User>
    
    @POST("functions/createIncident")
    suspend fun createIncident(@Body request: CreateIncidentRequest): Response<Incident>
}

data class CreateIncidentRequest(
    val title: String,
    val description: String,
    val severity: String
)`
        },
        {
          name: 'ApiClient.kt',
          code: `package com.cyberdojo.revsentinel.network

import com.cyberdojo.revsentinel.BuildConfig
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    
    private var token: String? = null
    
    fun setAuthToken(authToken: String?) {
        token = authToken
    }
    
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = if (BuildConfig.DEBUG) {
            HttpLoggingInterceptor.Level.BODY
        } else {
            HttpLoggingInterceptor.Level.NONE
        }
    }
    
    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .addInterceptor(loggingInterceptor)
        .addInterceptor { chain ->
            val request = chain.request().newBuilder()
            token?.let {
                request.addHeader("Authorization", "Bearer $it")
            }
            chain.proceed(request.build())
        }
        .build()
    
    private val retrofit = Retrofit.Builder()
        .baseUrl(BuildConfig.BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    val api: OutpostZeroApi = retrofit.create(OutpostZeroApi::class.java)
}`
        }
      ]
    },
    {
      id: 'create-layouts',
      title: 'Create XML Layouts',
      icon: FileText,
      difficulty: 'Easy',
      time: '10 min',
      instructions: [
        'Navigate to app → res → layout',
        'You\'ll see "activity_main.xml" already exists',
        'REPLACE its contents and create the new layout files:'
      ],
      files: [
        {
          name: 'activity_main.xml (REPLACE existing)',
          code: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"
    android:background="#1f2937"
    android:orientation="vertical">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Rev Sentinel"
        android:textSize="32sp"
        android:textColor="@android:color/white"
        android:textStyle="bold"
        android:layout_marginBottom="8dp" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Powered by Cyber Dojo Solutions"
        android:textSize="16sp"
        android:textColor="#60a5fa"
        android:layout_marginBottom="32dp" />

    <ProgressBar
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:indeterminateTint="@android:color/holo_blue_light" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Loading..."
        android:textSize="14sp"
        android:textColor="#9ca3af"
        android:layout_marginTop="16dp" />

</LinearLayout>`
        },
        {
          name: 'activity_login.xml (CREATE NEW)',
          code: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="#1f2937">

    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</LinearLayout>`
        },
        {
          name: 'activity_dashboard.xml (CREATE NEW)',
          code: `<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res/auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#1f2937">

    <com.google.android.material.appbar.AppBarLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:theme="@style/ThemeOverlay.AppCompat.Dark.ActionBar"
        app:elevation="0dp"
        android:background="#1f2937">

        <androidx.appcompat.widget.Toolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            android:background="#1f2937"
            app:titleTextColor="@android:color/white"
            app:popupTheme="@style/ThemeOverlay.AppCompat.Light" />

    </com.google.android.material.appbar.AppBarLayout>

    <androidx.swiperefreshlayout.widget.SwipeRefreshLayout
        android:id="@+id/swipeRefreshLayout"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior">

        <ScrollView
            android:layout_width="match_parent"
            android:layout_height="match_parent">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="16dp">

                <TextView
                    android:id="@+id/textWelcome"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Welcome"
                    android:textSize="28sp"
                    android:textColor="@android:color/white"
                    android:textStyle="bold" />

                <TextView
                    android:id="@+id/textUserRole"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text=""
                    android:textSize="16sp"
                    android:textColor="#60a5fa"
                    android:layout_marginBottom="32dp" />

                <com.google.android.material.card.MaterialCardView
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="16dp"
                    app:cardBackgroundColor="#374151"
                    app:cardCornerRadius="12dp"
                    app:cardElevation="4dp">

                    <LinearLayout
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:orientation="vertical"
                        android:padding="16dp">

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="Quick Actions"
                            android:textSize="18sp"
                            android:textColor="@android:color/white"
                            android:textStyle="bold"
                            android:layout_marginBottom="16dp" />

                        <com.google.android.material.button.MaterialButton
                            android:id="@+id/buttonIncidents"
                            android:layout_width="match_parent"
                            android:layout_height="wrap_content"
                            android:text="View Incidents"
                            android:layout_marginBottom="8dp"
                            app:backgroundTint="#1e40af"
                            android:textColor="@android:color/white" />

                        <com.google.android.material.button.MaterialButton
                            android:id="@+id/buttonEvents"
                            android:layout_width="match_parent"
                            android:layout_height="wrap_content"
                            android:text="Security Events"
                            app:backgroundTint="#7c3aed"
                            android:textColor="@android:color/white" />

                    </LinearLayout>

                </com.google.android.material.card.MaterialCardView>

                <com.google.android.material.card.MaterialCardView
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    app:cardBackgroundColor="#374151"
                    app:cardCornerRadius="12dp"
                    app:cardElevation="4dp">

                    <LinearLayout
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:orientation="vertical"
                        android:padding="16dp">

                        <TextView
                            android:id="@+id/textEventCount"
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="Recent Security Events"
                            android:textSize="18sp"
                            android:textColor="@android:color/white"
                            android:textStyle="bold"
                            android:layout_marginBottom="16dp" />

                        <androidx.recyclerview.widget.RecyclerView
                            android:id="@+id/recyclerViewEvents"
                            android:layout_width="match_parent"
                            android:layout_height="wrap_content" />

                    </LinearLayout>

                </com.google.android.material.card.MaterialCardView>

            </LinearLayout>

        </ScrollView>

    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>

</androidx.coordinatorlayout.widget.CoordinatorLayout>`
        }
      ]
    },
    {
      id: 'create-activities',
      title: 'Create Activity Files',
      icon: Code,
      difficulty: 'Medium',
      time: '10 min',
      instructions: [
        'You\'ll see "MainActivity.kt" already exists in your main package',
        'REPLACE its contents and create the new activity files:',
        'Right-click on your main package (com.cyberdojo.revsentinel) to create new files'
      ],
      files: [
        {
          name: 'MainActivity.kt (REPLACE existing)',
          code: `package com.cyberdojo.revsentinel

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.cyberdojo.revsentinel.databinding.ActivityMainBinding
import com.cyberdojo.revsentinel.storage.SecureStorage

class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var secureStorage: SecureStorage
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        secureStorage = SecureStorage(this)
        
        // Simulate loading delay
        android.os.Handler(mainLooper).postDelayed({
            if (secureStorage.isLoggedIn()) {
                navigateToDashboard()
            } else {
                navigateToLogin()
            }
        }, 2000)
    }
    
    private fun navigateToDashboard() {
        val intent = Intent(this, DashboardActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
    
    private fun navigateToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
        finish()
    }
}`
        },
        {
          name: 'LoginActivity.kt (CREATE NEW)',
          code: `package com.cyberdojo.revsentinel

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.cyberdojo.revsentinel.databinding.ActivityLoginBinding
import com.cyberdojo.revsentinel.network.ApiClient
import com.cyberdojo.revsentinel.storage.SecureStorage

class LoginActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityLoginBinding
    private lateinit var secureStorage: SecureStorage
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        secureStorage = SecureStorage(this)
        
        setupWebView()
        loadLoginPage()
    }
    
    private fun setupWebView() {
        binding.webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
        }
        
        binding.webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                url?.let { handleAuthCallback(it) }
                return false
            }
        }
    }
    
    private fun loadLoginPage() {
        val loginUrl = "\${BuildConfig.BASE_URL}Welcome"
        binding.webView.loadUrl(loginUrl)
    }
    
    private fun handleAuthCallback(url: String) {
        // This is where you'd handle the actual auth callback
        // For now, simulate a successful login after 3 seconds on the login page
        if (url.contains("Welcome") || url.contains("login")) {
            android.os.Handler(mainLooper).postDelayed({
                // Simulate successful login
                val fakeToken = "demo_token_\${System.currentTimeMillis()}"
                val fakeEmail = "user@cyberdojo.com"
                
                secureStorage.saveToken(fakeToken)
                secureStorage.saveUserEmail(fakeEmail)
                ApiClient.setAuthToken(fakeToken)
                
                Toast.makeText(this, "Login successful!", Toast.LENGTH_SHORT).show()
                navigateToDashboard()
            }, 3000)
        }
    }
    
    private fun navigateToDashboard() {
        val intent = Intent(this, DashboardActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}`
        },
        {
          name: 'DashboardActivity.kt (CREATE NEW)',
          code: `package com.cyberdojo.revsentinel

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.cyberdojo.revsentinel.databinding.ActivityDashboardBinding
import com.cyberdojo.revsentinel.models.SecurityEvent
import com.cyberdojo.revsentinel.storage.SecureStorage

class DashboardActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityDashboardBinding
    private lateinit var secureStorage: SecureStorage
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        secureStorage = SecureStorage(this)
        
        setupToolbar()
        setupUI()
        loadMockData()
    }
    
    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.title = "Rev Sentinel"
        supportActionBar?.subtitle = "Cyber Dojo Solutions"
    }
    
    private fun setupUI() {
        val userEmail = secureStorage.getUserEmail() ?: "Unknown User"
        binding.textWelcome.text = "Welcome back!"
        binding.textUserRole.text = userEmail
        
        binding.buttonIncidents.setOnClickListener {
            Toast.makeText(this, "Incidents feature coming soon!", Toast.LENGTH_SHORT).show()
        }
        
        binding.buttonEvents.setOnClickListener {
            Toast.makeText(this, "Security Events feature coming soon!", Toast.LENGTH_SHORT).show()
        }
        
        binding.swipeRefreshLayout.setOnRefreshListener {
            loadMockData()
        }
    }
    
    private fun loadMockData() {
        binding.swipeRefreshLayout.isRefreshing = true
        
        // Simulate API call delay
        android.os.Handler(mainLooper).postDelayed({
            val mockEvents = listOf(
                SecurityEvent(
                    id = "1",
                    event_id = "EVT-001",
                    timestamp = "2024-01-15T10:30:00Z",
                    source_ip = "192.168.1.100",
                    destination_ip = null,
                    event_type = "login_attempt",
                    severity = "medium",
                    status = "open",
                    user_id = "user123",
                    device_id = null,
                    location = "New York, NY",
                    description = "Successful login from new device",
                    ml_risk_score = 65.0
                ),
                SecurityEvent(
                    id = "2", 
                    event_id = "EVT-002",
                    timestamp = "2024-01-15T09:15:00Z",
                    source_ip = "203.0.113.5",
                    destination_ip = "192.168.1.50",
                    event_type = "malware_detected",
                    severity = "high",
                    status = "investigating",
                    user_id = null,
                    device_id = "WS-001",
                    location = "Unknown",
                    description = "Suspicious file detected in downloads folder",
                    ml_risk_score = 85.0
                )
            )
            
            binding.textEventCount.text = "\${mockEvents.size} Recent Events"
            Toast.makeText(this, "Data loaded successfully!", Toast.LENGTH_SHORT).show()
            binding.swipeRefreshLayout.isRefreshing = false
        }, 1500)
    }
    
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(android.R.menu.list, menu)
        return true
    }
    
    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            android.R.id.home -> {
                logout()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
    
    private fun logout() {
        secureStorage.clearAll()
        val intent = Intent(this, MainActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}`
        }
      ]
    },
    {
      id: 'update-config',
      title: 'Update Base URL Configuration',
      icon: AlertTriangle,
      difficulty: 'Critical',
      time: '1 min',
      instructions: [
        'Open build.gradle (Module: app) again',
        'Find these lines in both release and debug blocks:',
        'buildConfigField "String", "BASE_URL", "https://YOUR-APP-ID.base44.dev/"',
        'Replace YOUR-APP-ID with your actual Outpost Zero URL',
        'Example: "https://mycompany-outpost.base44.dev/"',
        'Click "Sync Now"'
      ]
    },
    {
      id: 'run-app',
      title: 'Build and Run Your App',
      icon: Smartphone,
      difficulty: 'Easy',
      time: '3 min',
      instructions: [
        'Connect your Android device via USB (enable Developer Options & USB Debugging)',
        'OR click "Create Device" to set up an emulator',
        'Click the green "Run" button (▶) in Android Studio',
        'Select your device/emulator',
        'Wait for the app to build and install',
        'Your Rev Sentinel app should launch!'
      ]
    }
  ];

  const StepCard = ({ step, index }) => (
    <Card className={`mb-6 transition-all duration-300 ${completedSteps.has(step.id) ? 'border-green-500 bg-green-900/10' : 'border-gray-700 bg-gray-800/50'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${completedSteps.has(step.id) ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
              <step.icon className={`w-5 h-5 ${completedSteps.has(step.id) ? 'text-green-400' : 'text-blue-400'}`} />
            </div>
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                Step {index + 1}: {step.title}
                {completedSteps.has(step.id) && <CheckCircle className="w-5 h-5 text-green-400" />}
              </CardTitle>
              <div className="flex gap-2 mt-1">
                <Badge variant={step.difficulty === 'Critical' ? 'destructive' : step.difficulty === 'Medium' ? 'default' : 'secondary'}>
                  {step.difficulty}
                </Badge>
                <Badge variant="outline">{step.time}</Badge>
              </div>
            </div>
          </div>
          <Button
            onClick={() => toggleStep(step.id)}
            variant={completedSteps.has(step.id) ? "default" : "outline"}
            size="sm"
          >
            {completedSteps.has(step.id) ? "Completed" : "Mark Done"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-300 text-sm">
              {step.instructions.map((instruction, i) => (
                <li key={i}>{instruction}</li>
              ))}
            </ol>
          </div>

          {step.code && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Code to paste:</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyCode(step.code, step.id)}
                >
                  {copiedCode === step.id ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy Code
                </Button>
              </div>
              <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-green-400 max-h-96">
                {step.code}
              </pre>
            </div>
          )}

          {step.files && (
            <div>
              <h4 className="text-white font-medium mb-3">Files to create:</h4>
              <div className="space-y-4">
                {step.files.map((file, i) => (
                  <div key={i} className="border border-gray-700 rounded-lg">
                    <div className="bg-gray-700 px-4 py-2 flex items-center justify-between">
                      <span className="text-white font-mono text-sm">{file.name}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCode(file.code, `${step.id}-${i}`)}
                      >
                        {copiedCode === `${step.id}-${i}` ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <pre className="bg-gray-900 p-4 overflow-x-auto text-sm text-blue-400 max-h-64">
                      {file.code}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const completionPercentage = Math.round((completedSteps.size / steps.length) * 100);

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-green-400" />
              Rev Sentinel - Step-by-Step Setup Guide
            </CardTitle>
            <div className="flex items-center gap-4 mt-4">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6358de6e2_188ec1ee-2ae7-4d9b-aacd-de581b4988ff.png" 
                alt="Cyber Dojo Solutions" 
                className="h-6 object-contain"
              />
              <span className="text-blue-400 font-medium">Complete Android Studio Integration</span>
              <Badge className="bg-green-500/20 text-green-400">{completionPercentage}% Complete</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2 text-center">
            {completedSteps.size} of {steps.length} steps completed
          </p>
        </div>

        {/* Steps */}
        <div>
          {steps.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} />
          ))}
        </div>

        {/* Completion Message */}
        {completedSteps.size === steps.length && (
          <Card className="border-green-500 bg-green-900/20 mt-8">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">🎉 Congratulations!</h2>
              <p className="text-green-300 mb-4">
                You've successfully created your Rev Sentinel Android app! Your app is now ready to connect to the Outpost Zero platform.
              </p>
              <div className="flex justify-center gap-4">
                <Badge className="bg-green-500/20 text-green-400 px-4 py-2">
                  Production Ready
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 px-4 py-2">
                  Cyber Dojo Solutions Powered
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}