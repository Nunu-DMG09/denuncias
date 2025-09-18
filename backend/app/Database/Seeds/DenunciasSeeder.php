<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DenunciasSeeder extends Seeder
{
    public function run()
    {
        // Insert data into administrador
        $this->db->table('administrador')->insert([
            'dni' => '40346175',
            'nombre' => 'TUÑOQUE J. MARTHA L.',
            'password' => password_hash('40346175', PASSWORD_DEFAULT),
            'rol' => 'super_admin',
            'estado' => '1',
            'area' => 'SGITP'
        ]);

        // Insert admin Corrupción
        $this->db->table('administrador')->insert([
            'dni' => '12345678',
            'nombre' => 'ADMIN CORRUPCION',
            'password' => password_hash('12345678', PASSWORD_DEFAULT),
            'rol' => 'admin',
            'estado' => '1',
            'area' => 'CORRUPCION'
        ]);

        // Insert admin Consumidor
        $this->db->table('administrador')->insert([
            'dni' => '87654321',
            'nombre' => 'ADMIN CONSUMIDOR',
            'password' => password_hash('87654321', PASSWORD_DEFAULT),
            'rol' => 'admin',
            'estado' => '1',
            'area' => 'CONSUMIDOR'
        ]);

        // Insert data into motivo
        $this->db->table('motivo')->insertBatch([
            [
                'id' => 1,
                'nombre' => 'Acceso a ventajas indebidas (incluye soborno nacional y transnacional)',
                'descripcion' => 'Cuando el servidor propicia, solicita o acepta alguna ventaja o beneficio indebido (regalos, donaciones a título personal, bienes, incentivos, cortesías o favores). Incluye el soborno a un servidor público extranjero para obtener o retener un negocio u otra ventaja indebida en la realización de actividades económicas o comerciales internacionales.'
            ],
            [
                'id' => 2,
                'nombre' => 'Invocación de influencias en el Estado',
                'descripcion' => 'Cuando el servidor utiliza o simula su capacidad de influencia en el sector público para obtener un beneficio o una ventaja irregular.'
            ],
            [
                'id' => 3,
                'nombre' => 'Mantener intereses en conflicto',
                'descripcion' => 'Cuando el servidor mantiene vínculos familiares, comerciales, institucionales o laborales que podrían afectar el manejo imparcial de los asuntos a su cargo y las relaciones de la entidad con actores externos.'
            ],
            [
                'id' => 4,
                'nombre' => 'Obstrucción al acceso a la información pública',
                'descripcion' => 'Cuando el servidor se rehúsa a entregar información pública solicitada por los conductos regulares que no sea reservada, confidencial o secreta, de acuerdo con las normas vigentes.'
            ],
            [
                'id' => 5,
                'nombre' => 'Abuso de autoridad',
                'descripcion' => 'Cuando el servidor comete u ordena un acto arbitrario alegando el cumplimiento de sus funciones.'
            ],
            [
                'id' => 6,
                'nombre' => 'Favorecimiento indebido',
                'descripcion' => 'Cuando el servidor utiliza su cargo para favorecer irregularmente a alguna persona por un interés particular o por un interés ajeno al cumplimiento de sus funciones.'
            ],
            [
                'id' => 7,
                'nombre' => 'Apropiación o uso indebido de recursos, bienes o información del Estado',
                'descripcion' => 'Cuando el servidor se adueña o utiliza de manera indebida dinero, recursos (incluyendo el tiempo asignado a la función pública), bienes o información del Estado.'
            ],
            [
                'id' => 8,
                'nombre' => 'Otros',
                'descripcion' => 'Cualquier acto contrario a la Ley del Código de Ética de la Función Pública o conducta indebida no contemplada en las categorías anteriores, incluyendo irregularidades administrativas, conflictos de interés no declarados, u otros actos que comprometan la integridad de la función pública.'
            ]
        ]);

        $this->db->table('ambiental_cause')->insertBatch([
            [
                'id' => 1,
                'type' => 'Emisiones de Gases y Humos'
            ], 
            [
                'id' => 2,
                'type' => 'Vertimiento de Liquidos'
            ],
            [
                'id' => 3,
                'type' => 'Vertimiento de Solidos'
            ],
            [
                'id' => 4,
                'type' => 'Material Particulado'
            ],
            [
                'id' => 5,
                'type' => 'Ruidos'
            ],
        ]);

        $this->db->table('denounce_status')->insertBatch([
            [
                'id' => 1,
                'type' => 'REGISTRADO'
            ], 
            [
                'id' => 2,
                'type' => 'RECIBIDO'
            ],
            [
                'id' => 3,
                'type' => 'ATENDIDO'
            ],
        ]);

        $this->db->table('document_type')->insertBatch([
            [
                'id' => 1,
                'type' => 'DNI'
            ], 
            [
                'id' => 2,
                'type' => 'RUC'
            ],
        ]);

        $this->db->table('user')->insertBatch([
            [
                'id' => 1,
                'name' => 'Informatica',
                'mother_surname' => 'MDJLO',
                'paternal_surname' => 'MDJLO',
                'email' => 'informatica@gmail.com',
                'password' => 'ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413'
            ]
            ]);
    }
}
