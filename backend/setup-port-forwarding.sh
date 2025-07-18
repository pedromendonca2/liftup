#!/bin/bash

# Obter IP do WSL
WSL_IP=$(hostname -I | awk '{print $1}')
echo "IP do WSL: $WSL_IP"

# Configurar port forwarding (executar no PowerShell do Windows como admin)
echo "Execute no PowerShell do Windows como administrador:"
echo "netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=$WSL_IP"
echo ""
echo "Ou para remover se necessário:"
echo "netsh interface portproxy delete v4tov4 listenport=3001 listenaddress=0.0.0.0"
