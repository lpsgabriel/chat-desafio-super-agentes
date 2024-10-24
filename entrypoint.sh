# echo "Aguardando o banco de dados..."
# while ! nc -z db 5432; do
#   sleep 1
# done
# echo "Banco de dados está pronto!"
npx prisma generate
npx prisma migrate deploy
npm start