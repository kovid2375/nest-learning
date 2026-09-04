import * as winston from "winston";


export const winstonConfig:winston.LoggerOptions={
    transports:[
        new winston.transports.Console({
            format:winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        new winston.transports.File({
            filename:'log/error.log',
            level:'error',
            format:winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        new winston.transports.File({
            filename:'log/combined.log',
            format:winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
}
