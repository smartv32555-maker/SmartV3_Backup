#!/usr/bin/env bash
#------------------------------------------------------------------------------

# Gradle start up script for Linux/Unix Clean Version

#------------------------------------------------------------------------------
APP_HOME=$(dirname "$0")
APP_NAME=$(basename "$0")

# Find Java executable
if [ -n "$JAVA_HOME" ] ; then
JAVA_EXE="$JAVA_HOME/bin/java"
else
JAVA_EXE=$(which java)
fi

if [ -z "$JAVA_EXE" ] ; then
echo "ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH." >&2
echo "Please set the JAVA_HOME variable in your environment to match the" >&2
echo "location of your Java installation." >&2
exit 1
fi
CLASSPATH="$APP_HOME/gradle/wrapper/gradle-wrapper.jar"
CMD_LINE_ARGS="$@"

exec "$JAVA_EXE" -cp "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$CMD_LINE_ARGS"