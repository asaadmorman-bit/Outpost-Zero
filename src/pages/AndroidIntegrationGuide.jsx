import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Smartphone, Download, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AndroidIntegrationGuide() {
  const [copiedSection, setCopiedSection] = useState('');

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(''), 2000);
  };

  const gradleCode = `plugins {
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
            buildConfigField "String", "BASE_URL", '"https://your-app.base44.dev/"'
        }
        debug {
            buildConfigField "String", "BASE_URL", '"https://your-app.base44.dev/"'
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
}`;

  const manifestCode = `<?xml version="1.0" encoding="utf-8"?>
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
            
        <activity
            android:name=".IncidentsActivity"
            android:exported="false" />

    </application>

</manifest>`;

  const modelsCode = `// SecurityEvent.kt
package com.cyberdojo.revsentinel.models

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
) : Parcelable

// Incident.kt
package com.cyberdojo.revsentinel.models

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
) : Parcelable

// User.kt
package com.cyberdojo.revsentinel.models

data class User(
    val id: String,
    val email: String,
    val full_name: String,
    val role: String,
    val access_level: String
)`;

  const networkCode = `// ApiClient.kt
package com.cyberdojo.revsentinel.network

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
                request.addHeader("Authorization", "Bearer \$it")
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
}

// OutpostZeroApi.kt
package com.cyberdojo.revsentinel.network

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
)`;

  const mainActivityCode = `// MainActivity.kt
package com.cyberdojo.revsentinel

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
        
        // Check if user is already logged in
        if (secureStorage.isLoggedIn()) {
            navigateToDashboard()
        } else {
            navigateToLogin()
        }
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
}

// LoginActivity.kt
package com.cyberdojo.revsentinel

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
        if (url.contains("auth_token=")) {
            val uri = Uri.parse(url)
            val token = uri.getQueryParameter("auth_token")
            val email = uri.getQueryParameter("email")
            
            if (token != null && email != null) {
                secureStorage.saveToken(token)
                secureStorage.saveUserEmail(email)
                ApiClient.setAuthToken(token)
                
                navigateToDashboard()
            } else {
                Toast.makeText(this, "Authentication failed", Toast.LENGTH_SHORT).show()
            }
        }
    }
    
    private fun navigateToDashboard() {
        val intent = Intent(this, DashboardActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}`;

  const dashboardActivityCode = `// DashboardActivity.kt
package com.cyberdojo.revsentinel

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.cyberdojo.revsentinel.databinding.ActivityDashboardBinding
import com.cyberdojo.revsentinel.storage.SecureStorage
import com.cyberdojo.revsentinel.viewmodel.DashboardViewModel

class DashboardActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityDashboardBinding
    private lateinit var secureStorage: SecureStorage
    private val viewModel: DashboardViewModel by viewModels()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        secureStorage = SecureStorage(this)
        
        setupToolbar()
        setupRecyclerView()
        setupObservers()
        setupClickListeners()
        
        // Load data
        viewModel.loadDashboardData()
    }
    
    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.title = "Rev Sentinel"
        supportActionBar?.subtitle = "Cyber Dojo Solutions"
    }
    
    private fun setupRecyclerView() {
        binding.recyclerViewEvents.layoutManager = LinearLayoutManager(this)
    }
    
    private fun setupObservers() {
        viewModel.user.observe(this) { user ->
            binding.textWelcome.text = "Welcome, \${user.full_name}"
            binding.textUserRole.text = user.role
        }
        
        viewModel.securityEvents.observe(this) { events ->
            val adapter = SecurityEventAdapter(events) { event ->
                // Handle event click
                Toast.makeText(this, "Event: \${event.event_type}", Toast.LENGTH_SHORT).show()
            }
            binding.recyclerViewEvents.adapter = adapter
            binding.textEventCount.text = "\${events.size} Recent Events"
        }
        
        viewModel.isLoading.observe(this) { isLoading ->
            binding.swipeRefreshLayout.isRefreshing = isLoading
        }
        
        viewModel.error.observe(this) { error ->
            error?.let {
                Toast.makeText(this, it, Toast.LENGTH_LONG).show()
            }
        }
    }
    
    private fun setupClickListeners() {
        binding.swipeRefreshLayout.setOnRefreshListener {
            viewModel.loadDashboardData()
        }
        
        binding.buttonIncidents.setOnClickListener {
            startActivity(Intent(this, IncidentsActivity::class.java))
        }
    }
    
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.dashboard_menu, menu)
        return true
    }
    
    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_logout -> {
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
}`;

  const secureStorageCode = `// SecureStorage.kt
package com.cyberdojo.revsentinel.storage

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
}`;

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-green-400" />
              Complete Android Studio Project - Rev Sentinel
            </CardTitle>
            <p className="text-gray-400">
              Production-ready Android app connecting to your Outpost Zero backend
            </p>
            <div className="flex items-center gap-2 mt-2">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6358de6e2_188ec1ee-2ae7-4d9b-aacd-de581b4988ff.png" 
                alt="Cyber Dojo Solutions" 
                className="h-6 object-contain"
              />
              <span className="text-sm text-blue-400 font-medium">Powered by Cyber Dojo Solutions</span>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid grid-cols-6 lg:w-fit bg-gray-800 border-gray-700">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="layouts">Layouts</TabsTrigger>
          </TabsList>

          <TabsContent value="setup">
            <div className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    build.gradle (Module: app)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => copyToClipboard(gradleCode, 'gradle')}
                    >
                      {copiedSection === 'gradle' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-green-400 pt-12">
                      {gradleCode}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">AndroidManifest.xml</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => copyToClipboard(manifestCode, 'manifest')}
                    >
                      {copiedSection === 'manifest' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-blue-400 pt-12">
                      {manifestCode}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="models">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Data Models</CardTitle>
                <p className="text-gray-400 text-sm">Create these in app/src/main/java/com/cyberdojo/revsentinel/models/</p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => copyToClipboard(modelsCode, 'models')}
                  >
                    {copiedSection === 'models' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-yellow-400 pt-12">
                    {modelsCode}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Network Layer</CardTitle>
                <p className="text-gray-400 text-sm">Create these in app/src/main/java/com/cyberdojo/revsentinel/network/</p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => copyToClipboard(networkCode, 'network')}
                  >
                    {copiedSection === 'network' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-purple-400 pt-12">
                    {networkCode}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Secure Storage</CardTitle>
                <p className="text-gray-400 text-sm">Create this in app/src/main/java/com/cyberdojo/revsentinel/storage/</p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => copyToClipboard(secureStorageCode, 'storage')}
                  >
                    {copiedSection === 'storage' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-cyan-400 pt-12">
                    {secureStorageCode}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Main Activities</CardTitle>
                <p className="text-gray-400 text-sm">Create these in your main package</p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => copyToClipboard(mainActivityCode + '\n\n' + dashboardActivityCode, 'activities')}
                  >
                    {copiedSection === 'activities' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-orange-400 pt-12">
                    {mainActivityCode}
                    {'\n\n'}
                    {dashboardActivityCode}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layouts">
            <div className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">XML Layouts</CardTitle>
                  <p className="text-gray-400 text-sm">Create these in app/src/main/res/layout/</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-white">
                      <h4 className="font-semibold mb-2">activity_main.xml:</h4>
                      <pre className="bg-gray-900 rounded p-3 text-sm text-gray-300 overflow-x-auto">
{`<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"
    android:background="#1f2937"
    android:orientation="vertical">

    <ImageView
        android:layout_width="120dp"
        android:layout_height="120dp"
        android:src="@drawable/cyber_dojo_logo"
        android:layout_marginBottom="24dp" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Rev Sentinel"
        android:textSize="24sp"
        android:textColor="@android:color/white"
        android:textStyle="bold" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Powered by Cyber Dojo Solutions"
        android:textSize="14sp"
        android:textColor="#9ca3af"
        android:layout_marginTop="8dp" />

    <ProgressBar
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="32dp"
        android:indeterminateTint="@android:color/holo_blue_light" />

</LinearLayout>`}
                      </pre>
                    </div>
                    
                    <div className="text-white">
                      <h4 className="font-semibold mb-2">activity_login.xml:</h4>
                      <pre className="bg-gray-900 rounded p-3 text-sm text-gray-300 overflow-x-auto">
{`<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="#1f2937">

    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</LinearLayout>`}
                      </pre>
                    </div>

                    <div className="text-white">
                      <h4 className="font-semibold mb-2">activity_dashboard.xml:</h4>
                      <pre className="bg-gray-900 rounded p-3 text-sm text-gray-300 overflow-x-auto">
{`<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res/auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#1f2937">

    <com.google.android.material.appbar.AppBarLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:theme="@style/ThemeOverlay.AppCompat.Dark.ActionBar">

        <androidx.appcompat.widget.Toolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            android:background="@android:color/transparent"
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
                    android:textSize="24sp"
                    android:textColor="@android:color/white"
                    android:textStyle="bold" />

                <TextView
                    android:id="@+id/textUserRole"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text=""
                    android:textSize="14sp"
                    android:textColor="#9ca3af"
                    android:layout_marginBottom="24dp" />

                <com.google.android.material.button.MaterialButton
                    android:id="@+id/buttonIncidents"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="View Incidents"
                    android:layout_marginBottom="16dp"
                    app:backgroundTint="@android:color/holo_blue_dark" />

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

        </ScrollView>

    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>

</androidx.coordinatorlayout.widget.CoordinatorLayout>`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-900/20 border-green-700">
                <CardContent className="p-4">
                  <h3 className="text-green-400 font-semibold mb-2">✅ Next Steps:</h3>
                  <ol className="text-gray-300 space-y-1 text-sm">
                    <li>1. Create new Android Studio project with the name "RevSentinel"</li>
                    <li>2. Copy all the code sections above into their respective files</li>
                    <li>3. Replace "your-app.base44.dev" with your actual Outpost Zero URL</li>
                    <li>4. Add the Cyber Dojo logo to res/drawable/</li>
                    <li>5. Build and run your app!</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}