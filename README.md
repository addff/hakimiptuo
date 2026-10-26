web11:
  image: php:8.5-apache
  command: php -S 0.0.0.0:80 -t /var/www/html
  user: www-data
  volumes:
    - './ITT588_LabWork4:/var/www/html'
  ports:
    - '41080:80'
