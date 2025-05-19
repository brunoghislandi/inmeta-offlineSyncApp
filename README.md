# FieldSync

Aplicativo mobile **Offline-First** para gerenciamento de ordens de serviço, construído com **React Native**, **Expo**, **Realm** e **Zustand**.

---

## Visão Geral

O FieldSync permite aos técnicos visualizar, criar e editar ordens de serviço, mesmo sem conexão com a internet. As alterações são salvas localmente usando Realm e podem ser sincronizadas com o servidor assim que a conexão for restabelecida.

---

## Tecnologias Principais

- **React Native** com **Expo SDK 53**
- **TypeScript**
- **Realm** para banco de dados offline
- **Zustand** para gerenciamento de estado global
- **React Hook Form** + **Yup** para formulários e validações
- **Axios** para integração com API
- **Java 17** necessário para o build Android

---

## Estrutura de pastas

```
src/
├─ api/ # Integrações com a API
├─ models/ # Definições de modelos do Realm
├─ navigation/ # Lógicas de navegação
├─ screens/ # Telas do aplicativo
├─ store/ # Zustand (estado global)
├─ sync/ # Lógica de sincronização offline
```

## Como Executar

1. Instale as dependências:

```bash
npm install
# ou
yarn install
```

2. Inicie o projeto (Via emulador android)

```
npm run android

yarn android
```
