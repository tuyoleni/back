#!/bin/bash

# Run the SQL initialization script
psql -U postgres -f init.sql 