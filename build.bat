@echo off
IF EXIST "./Release/com.marlburrow.uptime-kuma.streamDeckPlugin" DEL "com.marlburrow.uptime-kuma.streamDeckPlugin" /s
@echo on

call yarn build

DistributionTool.exe -b -i dist/com.marlburrow.uptime-kuma.sdPlugin -o Release
start Release/com.marlburrow.uptime-kuma.streamDeckPlugin