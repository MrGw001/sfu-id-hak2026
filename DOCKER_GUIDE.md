# Руководство по запуску проекта в Docker 🐳

Данный проект содержит готовые конфигурации для сборки и развертывания через Docker и Docker Compose.

---

## ⚡ Быстрый старт (все сервисы одной командой)

В корневой директории проекта выполните:

```bash
docker compose up --build
```

После завершения сборки приложение будет доступно по адресам:
- **Веб-интерфейс СФУ (Фронтенд):** [http://localhost:3000](http://localhost:3000) (или [http://localhost:80](http://localhost:80))
- **FastAPI Backend:** [http://localhost:8000](http://localhost:8000)
- **Swagger документация API:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Redis Cache:** `localhost:6379`

Остановить контейнеры:
```bash
docker compose down
```

---

## 🚀 Сборка и запуск только фронтенда (React SPA + Nginx)

Если вам нужен только веб-портал без бэкенда и базы данных:

### 1. Сборка Docker-образа
```bash
docker build -t sfu-portal .
```

### 2. Запуск контейнера
```bash
docker run -d -p 3000:80 --name sfu-portal-app sfu-portal
```
Откройте в браузере: **http://localhost:3000**

### 3. Остановка и удаление контейнера
```bash
docker stop sfu-portal-app && docker rm sfu-portal-app
```

---

## ⚠️ Решение ошибки: `dockerfile line greater than max allowed size of 65535`

### Почему возникает эта ошибка?
В движке сборки Docker (BuildKit) установлен строгий лимит: **длина одной строки в файле Dockerfile не может превышать 65535 байт (64 КБ)**.

Ошибка возникает в 99% случаев по одной из трех причин:

### Причина 1: Сбились переносы строк (файл превратился в одну огромную строку)
Часто при копировании текста через буфер обмена на Windows или сохранении в некоторых редакторах переносы строк заменяются либо на устаревший `CR` (`\r` без `\n`), либо удаляются вовсе. Для парсера Docker весь многострочный файл выглядит как **одна строка длиной во весь файл**, что вызывает превышение лимита.

**Как исправить:**
1. В редакторе **VS Code**: в правом нижнем углу окна переключите кодировку переноса строк с **CRLF** (или CR) на **LF**.
2. В консоли Linux / macOS / WSL:
   ```bash
   dos2unix Dockerfile
   # или
   sed -i 's/\r$//' Dockerfile
   ```
3. Либо пересоздайте чистый `Dockerfile` из шаблона ниже.

### Причина 2: Команда `docker build` запущена не в той папке
Если в рабочей директории случайно лежит бинарный файл, архив или скрипт с именем `Dockerfile`, Docker попытается прочитать его как текстовые инструкции.

**Как исправить:**
Убедитесь, что находитесь в корне проекта (где лежат `package.json` и `src`):
```bash
pwd
ls -la Dockerfile
```

### Причина 3: Загрязнение кэша сборщика BuildKit
Иногда старый кэш предыдущей неудачной сборки приводит к сбою парсинга.

**Как исправить:**
```bash
docker builder prune -a
# Запуск сборки без кэша:
docker build --no-cache -t sfu-portal .
```

---

## 📄 Эталонное содержимое Dockerfile (минималистичный и надежный)

Если ваш локальный `Dockerfile` был поврежден, замените его содержимое на этот чистый вариант:

```dockerfile
# Этап 1: Сборка фронтенда
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps --no-audit --no-fund --prefer-offline
COPY . .
RUN npm run build

# Этап 2: Раздача через легковесный Nginx
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 3000
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🛠 Полезные команды Docker

| Команда | Описание |
|---|---|
| `docker compose up -d` | Фоновый запуск сервисов |
| `docker compose logs -f` | Просмотр логов в реальном времени |
| `docker compose ps` | Статус запущенных контейнеров |
| `docker ps` | Список всех активных контейнеров |
| `docker logs sfu-portal-app` | Логи контейнера фронтенда |
| `docker system prune -f` | Очистка неиспользуемых образов и кэша |
