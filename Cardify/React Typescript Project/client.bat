cd client

IF NOT EXIST "node_modules" (
  cls
  echo node_modules folder doesn't exists
  pause
  npm i
  cls
  echo node_modules folder created
  pause
  npm start
) ELSE (
  cls
  npm start
)