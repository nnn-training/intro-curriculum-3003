FROM node:20.11.0

RUN apt-get update
RUN apt-get install -y locales
RUN apt-get install -y git
RUN apt-get install -y procps
RUN locale-gen ja_JP.UTF-8
RUN localedef -f UTF-8 -i ja_JP ja_JP
ENV LANG=ja_JP.UTF-8
ENV TZ=Asia/Tokyo
WORKDIR /intro-curriculum-3003
