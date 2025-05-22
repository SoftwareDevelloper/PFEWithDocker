FROM openjdk:17-jdk AS build

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw         
RUN ./mvnw dependency:go-offline -B

COPY src src

RUN ./mvnw package -DskipTests

FROM openjdk:17-jdk

WORKDIR /app

COPY --from=build /app/target/BackendPFE-0.0.1-SNAPSHOT.jar app.jar
COPY src/main/resources/ml-python ./ml-python

# Install Python & pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Install Python dependencies
RUN pip3 install --no-cache-dir -r ml-python/requirements.txt

EXPOSE 9000

ENTRYPOINT ["java", "-jar", "app.jar"]
