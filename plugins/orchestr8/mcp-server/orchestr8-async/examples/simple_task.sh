#!/bin/bash
# Example: Create and monitor a simple async task

API_URL="http://localhost:3000/api"

echo "Creating async task..."
TASK_RESPONSE=$(curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research AI Safety",
    "agent_name": "research-agent",
    "agent_instructions": "Search for and summarize the top 10 papers on AI safety from 2024",
    "priority": "high",
    "timeout_seconds": 3600
  }')

TASK_ID=$(echo $TASK_RESPONSE | jq -r '.task_id')
echo "Task created: $TASK_ID"
echo ""

echo "Waiting for task to complete..."
while true; do
  STATUS=$(curl -s "$API_URL/tasks/$TASK_ID" | jq -r '.task.status')
  echo "Current status: $STATUS"

  if [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ]; then
    break
  fi

  sleep 5
done

echo ""
echo "Final result:"
curl -s "$API_URL/tasks/$TASK_ID" | jq '.task'
