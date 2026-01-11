# Avatares de Instrutores

Este diretório armazena as imagens de avatar dos instrutores.

## Como Adicionar Avatares

### Opção 1: URL Externa (Recomendado para GitHub, etc.)

No arquivo `instructors.yml`:

```yaml
instructors:
  - id: seu-id
    name: Seu Nome
    avatar: https://avatars.githubusercontent.com/u/123456?v=4
    # ... outros campos
```

### Opção 2: Arquivo Local

1. Adicione a imagem nesta pasta com o nome do ID do instrutor:
   - `seu-id.png`
   - `seu-id.jpg`
   - `seu-id.jpeg`
   - `seu-id.webp`

2. No arquivo `instructors.yml`, você pode omitir o campo `avatar` ou definir como local:

```yaml
instructors:
  - id: seu-id
    name: Seu Nome
    # avatar será carregado automaticamente de images/seu-id.png
    # ... outros campos
```

## Formatos Suportados

- PNG (.png)
- JPEG (.jpg, .jpeg)
- WebP (.webp)

## Recomendações

- **Tamanho**: 200x200 pixels ou maior
- **Formato**: PNG ou WebP para melhor qualidade
- **Peso**: Até 500KB por imagem

## Avatar Padrão

Se nenhuma imagem for fornecida, o sistema usa um avatar padrão com as iniciais do nome.

## Exemplos

```
images/
├── waltenne.png          # Avatar local do instrutor waltenne
├── comunidade-aprendi.png # Avatar da comunidade
└── joao-silva.jpg         # Avatar do instrutor joao-silva
```
