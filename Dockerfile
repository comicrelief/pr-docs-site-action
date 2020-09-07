FROM node:12

WORKDIR /action
ENV PATH=$PATH:/root/.pulumi/bin
ENV PULUMI_HOME=/action
COPY package.json yarn.lock ./

RUN curl -fsSL https://get.pulumi.com | sh
RUN yarn install

COPY . /action

ENTRYPOINT ["/action/entrypoint.sh"]
