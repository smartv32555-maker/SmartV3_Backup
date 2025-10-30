# Set the URL for the missing file (version 8.6 is usually stable)
$url = "https://repo1.maven.org/maven2/org/gradle/gradle-wrapper/8.6/gradle-wrapper-8.6.jar"
$outputPath = "C:\SmartV3\gradle\wrapper\gradle-wrapper.jar"

Write-Host "Starting download of the missing gradle-wrapper.jar..."
Write-Host "Source: $url"
Write-Host "Target: $outputPath"

# Download the file using Invoke-WebRequest, which often bypasses network blocks better than web browsers
try {
    # Check if the wrapper folder exists, if not, create it
    if (-not (Test-Path "C:\SmartV3\gradle\wrapper")) {
        New-Item -ItemType Directory -Force -Path "C:\SmartV3\gradle\wrapper"
    }
    
    # Download the file
    Invoke-WebRequest -Uri $url -OutFile $outputPath -TimeoutSec 60
    Write-Host "Successfully created the missing file: gradle-wrapper.jar"
    Write-Host "---"
    
    # Run the final build command
    $env:JAVA_HOME = "C:\jdk-17.0.16.8-hotspot"
    Write-Host "Starting Final Build..."
    & "${env:JAVA_HOME}\bin\java.exe" -jar $outputPath clean assembleRelease --no-daemon --rerun-tasks --refresh-dependencies

} catch {
    Write-Error "Failed to download or run the build. Network/Proxy might be blocking PowerShell."
    Write-Host "---"
    Write-Host "ERROR DETAILS: $($_.Exception.Message)"
    Write-Host "Please try the build command manually if the download fails:"
    Write-Host '& "C:\jdk-17.0.16.8-hotspot\bin\java.exe" -jar "C:\SmartV3\gradle\wrapper\gradle-wrapper.jar" clean assembleRelease --no-daemon --rerun-tasks --refresh-dependencies'
}