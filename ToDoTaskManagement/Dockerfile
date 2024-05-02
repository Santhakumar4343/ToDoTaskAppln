
FROM openjdk:17-jdk-alpine


WORKDIR /app


COPY target/*.jar /app/todo.jar


ENTRYPOINT exec java $JAVA_OPTS -jar todo.jar