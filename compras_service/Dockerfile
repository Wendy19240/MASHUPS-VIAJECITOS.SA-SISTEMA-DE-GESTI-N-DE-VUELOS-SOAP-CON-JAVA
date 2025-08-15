FROM payara/server-full:6.2025.4-jdk17

# Variables de entorno para la base de datos local
ENV DB_HOST=host.docker.internal
ENV DB_PORT=3306
ENV DB_NAME=aerolineas_condor_db
ENV DB_USER=root
ENV DB_PASSWORD=root

# Copiar el driver MySQL JDBC
COPY docker/lib/mysql-connector-j-8.0.33.jar /opt/payara/appserver/glassfish/domains/domain1/lib/

# Copiar el WAR de tu aplicación
COPY target/*.war $DEPLOY_DIR

# Configurar el datasource al iniciar el servidor
COPY docker/post-boot-commands.asadmin $POSTBOOT_COMMANDS

# Exponer puertos
EXPOSE 8080 4848 9009

# Usar el comando por defecto de Payara que ejecutará los post-boot-commands automáticamente
CMD ["asadmin", "start-domain", "--verbose", "domain1"]