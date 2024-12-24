# Port Configuration Reader

A TypeScript project demonstrating different approaches to read and validate port numbers from JSON configuration files.

## 🌟 Overview

This application showcases various programming paradigms by implementing a simple task: reading a port number from `config.json`, validating it, and using fallback values when needed. Each implementation in the `src` directory represents a different approach to solving this problem.

## 💡 Implementations

### 1. Synchronous File System
> [`src/01_sync-fs/main.ts`](src/01_sync-fs/main.ts)
- Uses Node.js synchronous file system operations
- Simple error handling with try/catch
- Straightforward imperative approach

### 2. Async/Await
> [`src/02_async-fs/main.ts`](src/02_async-fs/main.ts)
- Uses Node.js promises-based file system operations
- Modern async/await syntax
- Promise-based error handling

### 3. RxJS
> [`src/03_rxjs/main.ts`](src/03_rxjs/main.ts)
- Reactive programming approach using RxJS
- Stream-based data processing
- Functional operators for data transformation

### 4. fp-ts
> [`src/04_fp-ts/main.ts`](src/04_fp-ts/main.ts)
- Functional programming approach using fp-ts
- Type-safe error handling with Either and TaskEither
- Pure functional composition

### 5. Effect
> [`src/05_effect/main.ts`](src/05_effect/main.ts)
- Modern functional effects system
- Robust error handling
- Type-safe computations

## 🚀 Getting Started

### Prerequisites
- Bun runtime v1.1.42 or higher
- TypeScript knowledge
- Basic understanding of functional programming concepts

### Installation
```bash
bun install
```

### Running Examples
Execute any implementation using:
```bash
bun src/<implementation-folder>/main.ts
```

Example:
```bash
bun src/01_sync-fs/main.ts
```

## ⚙️ Configuration

Create a `config.json` file with the following structure:
```json
{
    "port": 8080
}
```

> **Note**: If the file is missing, malformed, or the port is invalid, it will fall back to port 3000.

## 🛡️ Error Handling

All implementations handle these cases:
- Missing config file
- Invalid JSON format
- Missing port property
- Invalid port number
- Port number out of range (1-65535)

## 📦 Dependencies

- `effect` - Functional effect system
- `fp-ts` - Functional programming utilities
- `rxjs` - Reactive Extensions for JavaScript

## 📁 Project Structure

```
├── assets/
│   └── config.json         # Configuration file
├── src/
│   ├── 01_sync-fs/        # Synchronous implementation
│   ├── 02_async-fs/       # Async/Await implementation
│   ├── 03_rxjs/           # RxJS implementation
│   ├── 04_fp-ts/          # fp-ts implementation
│   ├── 05_effect/         # Effect implementation
│   └── shared/            # Shared utilities and types
└── tsconfig.json          # TypeScript configuration
```

## 📄 License

MIT

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
