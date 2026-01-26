#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHART_PID="$SCRIPT_DIR/mcp-server-chart.pid"
EMAIL_PID="$SCRIPT_DIR/mcp-email-docker.pid"
EXCEL_PID="$SCRIPT_DIR/excel-mcp-server.pid"

stop_service() {
  local pidfile=$1; local name=$2
  if [ -f "$pidfile" ]; then
    PID=$(cat "$pidfile")
    if kill -0 "$PID" 2>/dev/null; then
      echo "🛑 停止 $name (PID: $PID)..."
      kill "$PID"
      for i in {1..10}; do
        if ! kill -0 "$PID" 2>/dev/null; then break; fi
        sleep 0.5
      done
      if kill -0 "$PID" 2>/dev/null; then
        echo "⚠️  强制终止 $name"
        kill -9 "$PID"
      fi
      rm -f "$pidfile"
      echo "✅ $name 已停止"
    else
      echo "⚠️  $name 进程已退出，清理 PID 文件"
      rm -f "$pidfile"
    fi
  else
    echo "✅ $name 未运行"
  fi
}

stop_service "$CHART_PID" "mcp-server-chart"
stop_service "$EMAIL_PID" "mcp-email-docker"
stop_service "$EXCEL_PID" "excel-mcp-server"
echo "🔚 全部服务已停止"