const request = require('supertest');
jest.mock('../../src/db/pool',()=>({query:jest.fn()}));
const pool=require('../../src/db/pool');
const app=require('../../src/app');
const {signToken}=require('../../src/middleware/auth');
const token=signToken({id:1,username:'admin'});
describe('API del MVP AVIOR',()=>{
 beforeEach(()=>pool.query.mockReset());
 test('responde el estado de salud',async()=>{const r=await request(app).get('/api/health');expect(r.status).toBe(200);expect(r.body.status).toBe('ok')});
 test('rechaza acceso al directorio sin token',async()=>{const r=await request(app).get('/api/instructores');expect(r.status).toBe(401)});
 test('rechaza token inválido',async()=>{const r=await request(app).get('/api/registros').set('Authorization','Bearer no-es-token');expect(r.status).toBe(401)});
 test('lista instructores con sesión válida',async()=>{pool.query.mockResolvedValueOnce({rows:[{id:1,nombre:'Ana Rojas',tarifa_hora:'90.00'}]});const r=await request(app).get('/api/instructores').set('Authorization',`Bearer ${token}`);expect(r.status).toBe(200);expect(r.body[0].nombre).toBe('Ana Rojas')});
 test('valida el instructor antes de guardar',async()=>{const r=await request(app).post('/api/instructores').set('Authorization',`Bearer ${token}`).send({nombre:'A'});expect(r.status).toBe(400);expect(r.body.errors.length).toBeGreaterThan(0);expect(pool.query).not.toHaveBeenCalled()});
 test('devuelve preferencias del corte configurado',async()=>{pool.query.mockResolvedValueOnce({rows:[{id:1,tipo_corte:'dia_mes',valor:'17',notificar_app:true}]});const r=await request(app).get('/api/configuracion');expect(r.status).toBe(200);expect(r.body.tipo_corte).toBe('dia_mes');expect(r.body.proximo_corte).toMatch(/^\d{4}-\d{2}-\d{2}$/)});
 test('responde 404 para rutas inexistentes',async()=>{const r=await request(app).get('/api/no-existe');expect(r.status).toBe(404);expect(r.body.error).toBe('Ruta no encontrada')});
});
