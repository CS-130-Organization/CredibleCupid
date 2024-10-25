cd packages/frontend
call npm %*

rmdir "node_modules" /s /q 
echo "Done! Remember to run make again!"

cd ../..
