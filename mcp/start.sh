#!/bin/bash

# 获取脚本所在目录（绝对路径）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# PID 文件路径（统一放在脚本所在目录）
CHART_PID="$SCRIPT_DIR/mcp-server-chart.pid"
EMAIL_PID="$SCRIPT_DIR/mcp-email-docker.pid"
EXCEL_PID="$SCRIPT_DIR/excel-mcp-server.pid"

# ---------- 启动 mcp-server-chart ----------
if [ -f "$CHART_PID" ] && kill -0 "$(cat "$CHART_PID")" 2>/dev/null; then
  echo "⚠️ mcp-server-chart 已运行，跳过。"
else
  rm -f "$CHART_PID"
  echo "🚀 启动 mcp-server-chart..."
  if [ ! -d "$SCRIPT_DIR/mcp-server-chart" ]; then
    echo "❌ 找不到 mcp-server-chart 目录（期望路径: $SCRIPT_DIR/mcp-server-chart）"
    exit 1
  fi
  cd "$SCRIPT_DIR/mcp-server-chart" || exit 1
  nohup npm run start >/dev/null 2>&1 &
  echo $! > "$CHART_PID"
  cd - >/dev/null
  echo "✅ mcp-server-chart 启动成功，PID: $(cat "$CHART_PID")"
fi

# ---------- 启动 mcp-email-docker ----------
if [ -f "$EMAIL_PID" ] && kill -0 "$(cat "$EMAIL_PID")" 2>/dev/null; then
  echo "⚠️ mcp-email-docker 已运行，跳过。"
else
  rm -f "$EMAIL_PID"
  echo "🚀 启动 mcp-email-docker..."
  if [ ! -d "$SCRIPT_DIR/mcp-email-docker" ]; then
    echo "❌ 找不到 mcp-email-docker 目录（期望路径: $SCRIPT_DIR/mcp-email-docker）"
    exit 1
  fi
  cd "$SCRIPT_DIR/mcp-email-docker" || exit 1
  nohup npm start >/dev/null 2>&1 &
  echo $! > "$EMAIL_PID"
  cd - >/dev/null
  echo "✅ mcp-email-docker 启动成功，PID: $(cat "$EMAIL_PID")"
fi

# ---------- 启动 excel-mcp-server（无需虚拟环境）----------
if [ -f "$EXCEL_PID" ] && kill -0 "$(cat "$EXCEL_PID")" 2>/dev/null; then
  echo "⚠️ excel-mcp-server 已运行，跳过。"
else
  rm -f "$EXCEL_PID"
  echo "🚀 启动 excel-mcp-server (SSE)..."
  # ✅ 直接调用命令，环境变量内联
    EXCEL_FILES_PATH=/root/mcp/excel-mcp-server-main/tmp \
    FASTMCP_PORT=8007 \
    DOWNLOAD_LINK=http://agent.xyabcd.com:8007/files/ \
    excel-mcp-server sse >/dev/null 2>&1 &
  echo $! > "$EXCEL_PID"
  echo "✅ excel-mcp-server 启动成功，PID: $(cat "$EXCEL_PID")"
fi
