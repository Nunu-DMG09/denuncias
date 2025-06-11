<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DenunciasSeeder extends Seeder
{
    public function run()
    {
        // Insert data into administradores
        $this->db->table('administradores')->insert([
            'dni_admin' => '40346175',
            'nombres' => 'TUÑOQUE J. MARTHA L.',
            'password' => password_hash('40346175', PASSWORD_DEFAULT),
            'categoria' => 'super_admin',
            'estado' => 'activo'
        ]);

        // Insert data into motivos
        $this->db->table('motivos')->insertBatch([
            [
                'id' => 'mo221768',
                'nombre' => 'Acceso a ventajas indebidas (incluye soborno nacional y transnacional)',
                'descripcion' => 'Cuando el servidor propicia, solicita o acepta alguna ventaja o beneficio indebido (regalos, donaciones a título personal, bienes, incentivos, cortesías o favores). Incluye el soborno a un servidor público extranjero para obtener o retener un negocio u otra ventaja indebida en la realización de actividades económicas o comerciales internacionales.'
            ],
            [
                'id' => 'mo22176a',
                'nombre' => 'Invocación de influencias en el Estado',
                'descripcion' => 'Cuando el servidor utiliza o simula su capacidad de influencia en el sector público para obtener un beneficio o una ventaja irregular.'
            ],
            [
                'id' => 'mo58aa06',
                'nombre' => 'Mantener intereses en conflicto',
                'descripcion' => 'Cuando el servidor mantiene vínculos familiares, comerciales, institucionales o laborales que podrían afectar el manejo imparcial de los asuntos a su cargo y las relaciones de la entidad con actores externos.'
            ],
            [
                'id' => 'mo58aa1e',
                'nombre' => 'Obstrucción al acceso a la información pública',
                'descripcion' => 'Cuando el servidor se rehúsa a entregar información pública solicitada por los conductos regulares que no sea reservada, confidencial o secreta, de acuerdo con las normas vigentes.'
            ],
            [
                'id' => 'mo58aa1f',
                'nombre' => 'Abuso de autoridad',
                'descripcion' => 'Cuando el servidor comete u ordena un acto arbitrario alegando el cumplimiento de sus funciones.'
            ],
            [
                'id' => 'mod4b288',
                'nombre' => 'Favorecimiento indebido',
                'descripcion' => 'Cuando el servidor utiliza su cargo para favorecer irregularmente a alguna persona por un interés particular o por un interés ajeno al cumplimiento de sus funciones.'
            ],
            [
                'id' => 'mod4b28c',
                'nombre' => 'Apropiación o uso indebido de recursos, bienes o información del Estado',
                'descripcion' => 'Cuando el servidor se adueña o utiliza de manera indebida dinero, recursos (incluyendo el tiempo asignado a la función pública), bienes o información del Estado.'
            ],
            [
                'id' => 'mo_otros',
                'nombre' => 'Otros',
                'descripcion' => 'Cualquier acto contrario a la Ley del Código de Ética de la Función Pública o conducta indebida no contemplada en las categorías anteriores, incluyendo irregularidades administrativas, conflictos de interés no declarados, u otros actos que comprometan la integridad de la función pública.'
            ]
        ]);
    }
}
