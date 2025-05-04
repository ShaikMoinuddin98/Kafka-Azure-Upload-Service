
````markdown
# Kafka-based Azure Image Upload Service on Kubernetes

This repository contains the full setup for a Kafka-based image upload system using **Node.js** producer and consumer services deployed to **Kubernetes via Minikube**. Kafka is powered by the **Strimzi Operator**.

---

## 🛠️ Prerequisites

- Docker
- Kubernetes CLI (`kubectl`)
- Minikube
- DockerHub account

---

## ⚙️ Installation & Setup

### 1. Install Minikube

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
````

### 2. Start Minikube

```bash
minikube start
kubectl get nodes
```

---

## 🧵 Kafka Setup with Strimzi

### 1️⃣ Install Strimzi (Kafka Operator)

```bash
kubectl create namespace kafka
kubectl apply -f https://strimzi.io/install/latest?namespace=kafka -n kafka
```

---

### 2️⃣ Deploy Kafka Cluster

Create a file called `kafka-cluster.yaml` (already provided in this repo), then run:

```bash
kubectl apply -f kafka-cluster.yaml -n kafka
kubectl get pods -n kafka
```

---

### 3️⃣ Create Kafka Topic

Create a file named `kafka-topic.yaml` (already provided in this repo), then run:

```bash
kubectl apply -f kafka-topic.yaml -n kafka
```

---

## 📦 Environment Configurations

Make sure your `.env` file:

* Has no quotes around values
* Has no trailing comments

### Apply ConfigMaps:

```bash
kubectl create configmap kafka-producer-config --from-env-file=.env -n kafka
kubectl create configmap kafka-consumer-config --from-env-file=.env -n kafka
```

---

## 🏗️ Build & Push Docker Images

Replace `my-dockerhub-username` with your actual DockerHub username.

### Producer:

```bash
cd producer/
docker build -t my-producer .
docker tag my-producer my-dockerhub-username/my-producer
docker push my-dockerhub-username/my-producer
```

### Consumer:

```bash
cd consumer/
docker build -t my-consumer .
docker tag my-consumer my-dockerhub-username/my-consumer
docker push my-dockerhub-username/my-consumer
```

---

## 🚀 Deploy to Kubernetes

Apply the following YAMLs:

```bash
kubectl apply -f producer-deployment.yaml -n kafka
kubectl apply -f consumer-deployment.yaml -n kafka
```

Verify pods:

```bash
kubectl get pods -n kafka
```

---

## ✅ Test the Kafka Setup

### View Logs:

```bash
kubectl logs deployment/kafka-producer -n kafka
kubectl logs deployment/kafka-consumer -n kafka
```

---

## 🧹 Pod Management

### Restart a Pod:

```bash
kubectl delete pod <POD_NAME> -n kafka
```

---

## ⚙️ Modify Kafka Message Limits

Update the configurations in:

* `kafka-cluster.yaml`
* `kafka-topic.yaml`

---

## 📁 Project Structure

```
.
├── kafka-cluster.yaml
├── kafka-topic.yaml
├── producer/
│   ├── Dockerfile
│   ├── index.js
│   └── ...
├── consumer/
│   ├── Dockerfile
│   ├── index.js
│   └── ...
├── producer-deployment.yaml
├── consumer-deployment.yaml
└── README.md
```

---

## 📜 License

MIT License

```

Let me know if you want me to add example `.env` or `.yaml` templates inside this README too.
```
