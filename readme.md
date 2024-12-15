# 最初に

denoが熱そうなので公式を読んでいく  
https://docs.deno.com/runtime/getting_started/installation/  

# Linux(WSL2)環境にインストール

```bash
# インストール
$ curl -fsSL https://deno.land/install.sh | sh
# リスタート後に
$ deno --version
```

# hello world

以下を /work/helloworld/index.tsに作成しています。

```typescript 
function greet(name:string) {
  return `Hello, ${name}!`;
}

console.log(greet("world"));
```

```bash 
$ deno index.ts 
# Hello, world! 
```

# deno プロジェクト作成

/work/projectに作成します

```bash
$ deno init my_project
✅ Project initialized

Run these commands to get started

  cd my_project

  # Run the program
  deno run main.ts

  # Run the program and watch for file changes
  deno task dev

  # Run the tests
  deno test
```

# vscode拡張

なんか生成されたコードが型not foundとなっているのでvscode拡張導入

.vscode/extension.json

```json
{
 "recommendations":["denoland.vscode-deno"]
}
```

ワークスペース用にdenoを構成するには以下設定も
.vscode/settings.json   

```json
{
  "deno.enable": true
}
```

# vscode debugging

Run > Add Configrations > Deno  

.vscode/launch.jsonが作成されるが、
自動で生成される場合main.tsがルートに存在している前提なので
パスを適宜変更する。

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "request": "launch",
            "name": "myproject_main",
            "type": "node",
            "program": "${workspaceFolder}/work/project/my_project/main.ts",
            "cwd": "${workspaceFolder}",
            "env": {},
            "runtimeExecutable": "/home/hiro/.deno/bin/deno",
            "runtimeArgs": [
                "run",
                "--unstable",
                "--inspect-wait",
                "--allow-all"
            ],
            "attachSimplePort": 9229
        }
    ]
}
```

# モノレポ構成を構成する

work/project/my_project/main.ts   
だけではなく他プロジェクトもこちらのワークスペースが存在するとします。   
その場合の設定は以下のように   

work/project/my_project/deno.jsonに対してnameとexportを定義します。  

```json
{
  "name": "@scope/myproject",
  "version": "0.1.0",
  "exports": "./main.ts",
  "tasks": {
    "dev": "deno run --watch main.ts"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@1"
  }
}
```

ルートのmain.tsを作成して参照してみます。   
ルートに    
main.ts    
deno.json    
を作成して  

deno.jsonは  
```json
{
 "workspace": ["./work/project/my_project"]
}
```

とし、  
main.tsは  
```typescript
import { add } from "@scope/myproject";

if (import.meta.main) {
    console.log("Add 1 + 1 =", add(1, 1));
}
```
とします。
これでルートのmain.tsからモノレポのmy_projectを呼び出すことができるようになりました。   


# HTTPサーバーを起動してみる

```bash
deno init my_server
```

deno.json
```json
{
  "name": "@scope/myserver",
  "tasks": {
    "dev": "deno run --watch main.ts"
  },
  "exports": "./main.ts",
  "imports": {
    "@std/assert": "jsr:@std/assert@1"
  }
}
```

ルートのdeno.jsonのワークスペース追加も行う  
これをしないと「error: Config file must be a member of the workspace.」と表示される。　　

```json
{
 "workspace": ["./work/project/my_project","./work/project/my_server"]
}
```

以下実行    
denoは明示的にhttp許可を与える（--allow-net）ということをして起動しないと実行されない。  

```bash
deno run --allow-net main.ts
```
  
# HTTPサーバーでcurlリクエストをしてみる

```bash
deno init my_server_request
```

```bash
deno run --allow-all main.ts 
curl -i -X POST -d {test:'aaa'} http://localhost:8000/path/ttt?query=xxx
```

# HTTPサーバーでstream

```
deno init my_server_stream
```

```bash
deno run --allow-all main.ts
curl -i -X GET http://localhost:8000
```

# HTTPサーバーでWebSocket

```
deno init my_server_websocket
```

```bash
deno run --allow-all main.ts
```

index.htmlを起動してクライアントを待ち受ける