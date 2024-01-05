GLOBAL_ENV=".env.dev"
GLOBAL_ENV_SAMPLE=".env.sample"
if [[ ! -f $GLOBAL_ENV ]]; then
    cp $GLOBAL_ENV_SAMPLE $GLOBAL_ENV
    echo "CREATED $GLOBAL_ENV"
fi
docker compose -f docker-compose.dev.yml up --build -d --remove-orphans