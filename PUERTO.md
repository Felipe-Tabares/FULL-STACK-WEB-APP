# Configuración del Puerto

La aplicación está configurada para ejecutarse en el puerto **3090**.

## Ejecutar la aplicación

```bash
cd frontend
npm start
```

La aplicación estará disponible en: `http://localhost:3090`

## Configuración del Puerto

El puerto está configurado en el script `start` del `package.json`.

### Si necesitas cambiar el puerto

**Opción 1: Modificar package.json**
Edita `frontend/package.json` y cambia el puerto en el script `start`:
```json
"start": "set PORT=3090&& react-scripts start"
```

**Opción 2: Crear archivo .env (Recomendado para Linux/Mac)**
Crea un archivo `.env` en la carpeta `frontend`:
```
PORT=3090
```

**Opción 3: Variable de entorno del sistema**
En Windows PowerShell:
```powershell
$env:PORT=3090
npm start
```

En Linux/Mac:
```bash
export PORT=3090
npm start
```

