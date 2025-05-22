FROM openjdk:17-jdk-bullseye AS build

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

COPY src src

RUN ./mvnw package -DskipTests

FROM openjdk:17-jdk-bullseye

WORKDIR /app

COPY --from=build /app/target/BackendPFE-0.0.1-SNAPSHOT.jar app.jar
COPY src/main/resources/ml-python ./ml-python

# Use apt-get on Debian-based image
RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean

RUN pip3 install --no-cache-dir -r ml-python/requirements.txt

EXPOSE 9000

ENTRYPOINT ["java", "-jar", "app.jar"]
