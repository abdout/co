#!/bin/bash

# Generate an initial migration to create the Car model
npx prisma migrate dev --name add_car_model

# Regenerate the Prisma client
npx prisma generate 