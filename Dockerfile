FROM centos
#MAINTAINER IgorS

#prepare system
RUN yum -y update && yum clean all
RUN yum install -y yum-utils && yum clean all
RUN yum-builddep -y python
RUN yum install -y make && yum clean all

#create folders for apps
RUN mkdir /usr/codefolder

#we need node js
RUN yum install -y git && yum clean all
RUN curl -sL https://rpm.nodesource.com/setup_8.x | bash -
RUN yum install -y nodejs && yum clean all
RUN echo 'export NODE_PATH="'$(npm root -g)'"' >> /etc/profile.d/npm.sh
RUN npm install --unsafe-perm --global pm2
RUN npm install --unsafe-perm --global bip39
RUN npm install --unsafe-perm --global hdkey
RUN npm install --unsafe-perm --global fs
RUN npm install --unsafe-perm --global ethereumjs-wallet@0.6.0
RUN npm install --unsafe-perm --global truffle-hdwallet-provider@0.0.3
RUN npm install --unsafe-perm --global ethereumjs-util
RUN npm install --unsafe-perm --global web3
RUN npm install --unsafe-perm --global truffle
RUN npm install --unsafe-perm --global bitcoinjs-lib
RUN npm install --unsafe-perm --global bip32-utils

ADD codefolder /usr/codefolder

WORKDIR /usr/codefolder
CMD ["node","app.js"]


