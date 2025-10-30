// START WORKAROUND: Force Java 17 (Major Version 61) compatibility
gradle.beforeSettings { settings ->
    if (JavaVersion.current() > JavaVersion.VERSION_17) {
        settings.gradle.startParameter.systemPropertiesArgs['org.gradle.jvmargs'] = "-Dfile.encoding=UTF-8 -Xms256m -Xmx2048m --add-exports java.base/sun.nio.ch=ALL-UNNAMED"
        settings.gradle.startParameter.systemPropertiesArgs['org.gradle.jvmargs'] += " --illegal-access=permit"
        settings.gradle.startParameter.javaHome = new File("C:/jdk-17.0.16.8-hotspot")
    }
}
// END WORKAROUND

rootProject.name = "SmartV3"
// ... (โค้ดส่วนที่เหลือของ settings.gradle)
