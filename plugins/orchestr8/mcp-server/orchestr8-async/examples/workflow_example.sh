#!/bin/bash
# Example: Create a multi-phase workflow

API_URL="http://localhost:3000/api"

echo "=== Creating Feature Development Workflow ==="
echo ""

# 1. Create workflow
echo "1. Creating workflow..."
WORKFLOW_RESPONSE=$(curl -s -X POST "$API_URL/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Authentication Feature",
    "description": "Complete authentication feature with design, implementation, and testing"
  }')

WORKFLOW_ID=$(echo $WORKFLOW_RESPONSE | jq -r '.workflow_id')
echo "Workflow created: $WORKFLOW_ID"
echo ""

# 2. Add phases
echo "2. Adding phases..."

curl -s -X POST "$API_URL/workflows/$WORKFLOW_ID/phases" \
  -H "Content-Type: application/json" \
  -d '{
    "phase_id": "design",
    "name": "Design Phase",
    "depends_on": []
  }' | jq '.'

curl -s -X POST "$API_URL/workflows/$WORKFLOW_ID/phases" \
  -H "Content-Type: application/json" \
  -d '{
    "phase_id": "implementation",
    "name": "Implementation Phase",
    "depends_on": ["design"]
  }' | jq '.'

curl -s -X POST "$API_URL/workflows/$WORKFLOW_ID/phases" \
  -H "Content-Type: application/json" \
  -d '{
    "phase_id": "testing",
    "name": "Testing Phase",
    "depends_on": ["implementation"]
  }' | jq '.'

echo ""

# 3. Add tasks to phases
echo "3. Adding tasks to phases..."

DESIGN_TASK=$(curl -s -X POST "$API_URL/workflows/$WORKFLOW_ID/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "phase_id": "design",
    "name": "Architecture Design",
    "agent_name": "architect",
    "agent_instructions": "Design system architecture for OAuth2 authentication with JWT tokens",
    "priority": "high"
  }')

echo "Design task: $(echo $DESIGN_TASK | jq -r '.task_id')"

IMPL_TASK=$(curl -s -X POST "$API_URL/workflows/$WORKFLOW_ID/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "phase_id": "implementation",
    "name": "Backend Implementation",
    "agent_name": "backend-developer",
    "agent_instructions": "Implement OAuth2 authentication endpoints with JWT token generation",
    "priority": "high"
  }')

echo "Implementation task: $(echo $IMPL_TASK | jq -r '.task_id')"

TEST_TASK=$(curl -s -X POST "$API_URL/workflows/$WORKFLOW_ID/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "phase_id": "testing",
    "name": "Integration Testing",
    "agent_name": "test-engineer",
    "agent_instructions": "Create integration tests for authentication flow",
    "priority": "high"
  }')

echo "Testing task: $(echo $TEST_TASK | jq -r '.task_id')"
echo ""

# 4. Start workflow
echo "4. Starting workflow..."
curl -s -X POST "$API_URL/workflows/$WORKFLOW_ID/start" | jq '.'
echo ""

# 5. Monitor progress
echo "5. Monitoring workflow progress..."
while true; do
  STATUS=$(curl -s "$API_URL/workflows/$WORKFLOW_ID/status")

  WORKFLOW_STATUS=$(echo $STATUS | jq -r '.workflow.status')
  COMPLETED=$(echo $STATUS | jq -r '.completed_tasks')
  TOTAL=$(echo $STATUS | jq -r '.total_tasks')

  echo "Status: $WORKFLOW_STATUS | Progress: $COMPLETED/$TOTAL tasks"

  if [ "$WORKFLOW_STATUS" = "completed" ] || [ "$WORKFLOW_STATUS" = "failed" ]; then
    break
  fi

  sleep 10
done

echo ""
echo "=== Final Workflow Status ==="
curl -s "$API_URL/workflows/$WORKFLOW_ID/status" | jq '.'
