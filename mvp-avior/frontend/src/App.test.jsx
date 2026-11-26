import { describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach } from 'vitest';
import { Login, Status, money, monthName } from './App.jsx';

describe('interfaz AVIOR',()=>{
  afterEach(cleanup);
  it('formatea montos en bolivianos',()=>{expect(money(850)).toContain('850');expect(money(850)).toMatch(/Bs/)});
  it('formatea el periodo de pago',()=>{expect(monthName('2026-11')).toMatch(/noviembre/i)});
  it('identifica los registros pendientes',()=>{render(<Status value="Pendiente"/>);expect(screen.getByText('Pendiente')).toBeInTheDocument()});
  it('identifica los registros pagados',()=>{render(<Status value="Pagado"/>);expect(screen.getByText('Pagado')).toHaveClass('paid')});
  it('solicita usuario y contraseña',()=>{render(<Login onLogin={vi.fn()}/>);expect(screen.getByLabelText('Usuario')).toBeRequired();expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type','password')});
  it('envía las credenciales del administrador',async()=>{const onLogin=vi.fn().mockResolvedValue();render(<Login onLogin={onLogin}/>);fireEvent.change(screen.getByLabelText('Contraseña'),{target:{value:'secreto'}});fireEvent.click(screen.getByRole('button',{name:/ingresar al panel/i}));await waitFor(()=>expect(onLogin).toHaveBeenCalledWith('admin','secreto'))});
  it('muestra el error devuelto por el inicio de sesión',async()=>{render(<Login onLogin={vi.fn().mockRejectedValue(new Error('Credenciales incorrectas.'))}/>);fireEvent.change(screen.getByLabelText('Contraseña'),{target:{value:'incorrecta'}});fireEvent.click(screen.getByRole('button',{name:/ingresar al panel/i}));expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales incorrectas')});
});
