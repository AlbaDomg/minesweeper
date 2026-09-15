/* ==========================================================================
   CONFIGURACIÓN DE NIVELES DE DIFICULTAD
   ========================================================================== */

/**
 * Objeto constante con las configuraciones de cada nivel.
 * Define filas, columnas y total de minas según el estándar del Buscaminas.
 */
const DIFFICULTY_CONFIG = {
    easy: {
        name: 'Principiante',
        rows: 8,
        cols: 8,
        mines: 10
    },
    medium: {
        name: 'Intermedio',
        rows: 16,
        cols: 16,
        mines: 40
    },
    expert: {
        name: 'Experto',
        rows: 16,
        cols: 30,
        mines: 99
    }
};
