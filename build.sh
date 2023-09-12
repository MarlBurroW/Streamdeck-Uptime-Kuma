#!/bin/bash

if [ -f "./Release/com.marlburrow.uptime-kuma.streamDeckPlugin" ]; then
    rm "./Release/com.marlburrow.uptime-kuma.streamDeckPlugin"
fi

yarn build

./DistributionTool -b -i dist/com.marlburrow.uptime-kuma.sdPlugin -o Release

# This will open the file with the default program associated with it. 
# If you want to execute it instead, you'll need to make it executable and run it.
open "Release/com.marlburrow.uptime-kuma.streamDeckPlugin"
