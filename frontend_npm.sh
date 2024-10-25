cd packages/frontend
npm "$@" || true

rm -rf node_modules

echo "Done! Remember to run make again!"

cd ../..
