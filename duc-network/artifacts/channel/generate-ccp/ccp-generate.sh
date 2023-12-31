#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${HOSPITAL}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${HOSPITAL}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

HOSPITAL=1
P0PORT=7051
CAPORT=7054
PEERPEM=../crypto-config/peerOrganizations/hospital1.example.com/tlsca/tlsca.hospital1.example.com-cert.pem
CAPEM=../crypto-config/peerOrganizations/hospital1.example.com/ca/ca.hospital1.example.com-cert.pem

echo "$(json_ccp $HOSPITAL $P0PORT $CAPORT $PEERPEM $CAPEM)" > ccp/connection-hospital1.json
echo "$(yaml_ccp $HOSPITAL $P0PORT $CAPORT $PEERPEM $CAPEM)" > ccp/connection-hospital1.yaml

HOSPITAL=2
P0PORT=9051
CAPORT=8054
PEERPEM=../crypto-config/peerOrganizations/hospital2.example.com/tlsca/tlsca.hospital2.example.com-cert.pem
CAPEM=../crypto-config/peerOrganizations/hospital2.example.com/ca/ca.hospital2.example.com-cert.pem

echo "$(json_ccp $HOSPITAL $P0PORT $CAPORT $PEERPEM $CAPEM)" > ccp/connection-hospital2.json
echo "$(yaml_ccp $HOSPITAL $P0PORT $CAPORT $PEERPEM $CAPEM)" > ccp/connection-hospital2.yaml
