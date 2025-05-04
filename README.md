
---

# 📦 Kafka-Based Azure Image Upload with Minikube & Strimzi

This repository contains the complete setup for a Kafka-based image upload service using **Node.js** producer and consumer microservices. The services are deployed on **Kubernetes** (via **Minikube**) and use **Apache Kafka** (via the **Strimzi Operator**) for communication. The consumer handles image uploads to Azure Blob Storage.

---

## 🚀 Features

* Kafka Producer/Consumer built with Node.js
* Kubernetes-native Kafka via Strimzi
* Local setup using Minikube
* Configurable via `.env` files
* Dockerized services pushed to DockerHub
* Azure Blob upload handling by consumer

---

## 🛠️ Prerequisites

* [Docker](https://docs.docker.com/get-docker/)
* [Kubectl](https://kubernetes.io/docs/tasks/tools/)
* [Minikube](https://minikube.sigs.k8s.io/docs/start/)
* DockerHub account
* Azure Blob Storage credentials

---

## ⚙️ Installation & Setup

### 1. Install Minikube

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

### 2. Start Minikube

```bash
minikube start
kubectl get nodes
```

---

## 📡 Set Up Kafka with Strimzi

### 1️⃣ Install Strimzi Operator

```bash
kubectl create namespace kafka
kubectl apply -f https://strimzi.io/install/latest?namespace=kafka -n kafka
```

### 2️⃣ Deploy Kafka Cluster

Create `kafka-cluster.yaml` (included in repo), then apply it:

```bash
kubectl apply -f kafka-cluster.yaml -n kafka
kubectl get pods -n kafka
```

### 3️⃣ Create Kafka Topic

Create `kafka-topic.yaml` (included in repo), then apply it:

```bash
kubectl apply -f kafka-topic.yaml -n kafka
```

---

## 🔐 Environment Configuration

Ensure your `.env` files:

* Do **not** use quotes (`"`, `'`) around values
* Have **no comments** on the same line

### Apply as ConfigMaps:

```bash
kubectl create configmap kafka-producer-config --from-env-file=.env -n kafka
kubectl create configmap kafka-consumer-config --from-env-file=.env -n kafka
```

---

## 🐳 Build & Push Docker Images

Replace `my-dockerhub-username` with your DockerHub username.

### Producer

```bash
cd producer/
docker build -t my-producer .
docker tag my-producer my-dockerhub-username/my-producer
docker push my-dockerhub-username/my-producer
```

### Consumer

```bash
cd consumer/
docker build -t my-consumer .
docker tag my-consumer my-dockerhub-username/my-consumer
docker push my-dockerhub-username/my-consumer
```

---

## 🚀 Deploy Producer & Consumer

Apply Kubernetes deployments:

```bash
kubectl apply -f producer-deployment.yaml -n kafka
kubectl apply -f consumer-deployment.yaml -n kafka
kubectl get pods -n kafka
```

---

## 🧪 Test the Kafka Setup

Check logs to verify message flow:

```bash
kubectl logs deployment/kafka-producer -n kafka
kubectl logs deployment/kafka-consumer -n kafka
```

---

## 🔄 Pod Management

To delete or restart any pod:

```bash
kubectl delete pod <POD_NAME> -n kafka
```

---

## 📈 Increase Kafka Message Limits

You can increase message size limits by editing:

* `kafka-cluster.yaml`
* `kafka-topic.yaml`

---

## 🌐 Port Forwarding

To expose your services running inside Kubernetes to your local machine:

### Example: Forward Kafka Consumer App (port 3001)

```bash
kubectl port-forward deployment/kafka-consumer 3001:3001 -n kafka
```

### Example: Forward Kafka Producer App (port 3000)

```bash
kubectl port-forward deployment/kafka-producer 3000:3000 -n kafka
```

> You can then access them at `http://localhost:3000` and `http://localhost:3001`.

For exposing Kafka brokers or UI dashboards (like Kafka UI, if added), similar forwarding applies. Ensure the app listens on `0.0.0.0` inside the container.

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

---

Let me know if you'd like this README exported as a downloadable file or if you want to include Kafka UI tools in the setup.
