FROM node:16 as ts-compiler

# 앱 디렉터리 생성
WORKDIR /usr/src/room-server

# 앱 의존성 설치
# 가능한 경우(npm@5+) package.json과 package-lock.json을 모두 복사하기 위해
# 와일드카드를 사용
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install
# 프로덕션을 위한 코드를 빌드하는 경우
# RUN npm ci --only=production

# 앱 소스 추가
COPY . .

RUN npm run build

RUN chmod -R 755 /usr/src/room-server/server_binary/lop-server.x86_64

EXPOSE 2000
CMD [ "node", "dist/main.js" ]