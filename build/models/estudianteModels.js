"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Estudiante = void 0;
const typeorm_1 = require("typeorm");
const cursoModels_1 = require("./cursoModels");
let Estudiante = class Estudiante {
};
exports.Estudiante = Estudiante;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Estudiante.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Estudiante.prototype, "dni", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Estudiante.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Estudiante.prototype, "apellido", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Estudiante.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Estudiante.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Estudiante.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => cursoModels_1.Curso, (curso) => curso.estudiantes)
    // @JoinTable({
    //   name: "cursos_estudiantes",
    //   joinColumn: {
    //     name: "estudiante_id",
    //     referencedColumnName: "id",
    //   },
    //   inverseJoinColumn: {
    //     name: "curso_id",
    //     referencedColumnName: "id",
    //   },
    // })
    ,
    __metadata("design:type", Array)
], Estudiante.prototype, "cursos", void 0);
exports.Estudiante = Estudiante = __decorate([
    (0, typeorm_1.Entity)("estudiantes")
], Estudiante);
