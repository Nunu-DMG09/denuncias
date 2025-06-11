<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateDenunciasTables extends Migration
{
    public function up()
    {
        // Table: adjuntos
        $this->forge->addField([
            'id' => [
                'type' => 'VARCHAR',
                'constraint' => 8,
                'null' => false
            ],
            'denuncia_id' => [
                'type' => 'VARCHAR',
                'constraint' => 8,
                'null' => false
            ],
            'file_path' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false
            ],
            'file_name' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => false
            ],
            'file_type' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => false
            ],
            'fecha_subida' => [
                'type' => 'DATETIME',
                'default' => 'CURRENT_TIMESTAMP'
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('denuncia_id', 'denuncias', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('adjuntos');

        // Table: administradores
        $this->forge->addField([
            'dni_admin' => [
                'type' => 'VARCHAR',
                'constraint' => 8,
                'null' => false
            ],
            'nombres' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false
            ],
            'password' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false
            ],
            'categoria' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => false
            ],
            'estado' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => false
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->forge->addKey('dni_admin', true);
        $this->forge->createTable('administradores');

        // Table: denunciados
        $this->forge->addField([
            'id' => [
                'type' => 'VARCHAR',
                'constraint' => 8,
                'null' => false
            ],
            'nombre' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true
            ],
            'numero_documento' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => true
            ],
            'tipo_documento' => [
                'type' => 'ENUM',
                'constraint' => ['DNI', 'Carnet Extranjeria', 'RUC'],
                'default' => 'DNI'
            ],
            'representante_legal' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true
            ],
            'razon_social' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true
            ],
            'cargo' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('denunciados');

        // Table: denunciantes
        $this->forge->addField([
            'id' => [
                'type' => 'VARCHAR',
                'constraint' => 8,
                'null' => false
            ],
            'nombres' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false
            ],
            'email' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false
            ],
            'telefono' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => false
            ],
            'numero_documento' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => true
            ],
            'tipo_documento' => [
                'type' => 'ENUM',
                'constraint' => ['DNI', 'Carnet Extranjeria', 'RUC'],
                'default' => 'DNI'
            ],
            'sexo' => [
                'type' => 'ENUM',
                'constraint' => ['M', 'F'],
                'null' => true
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('denunciantes');

        // Table: denuncias
        $this->forge->addField([
            'id' => [
                'type' => 'VARCHAR',
                'constraint' => 8,
                'null' => false
            ],
            'tracking_code' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => false
            ],
            'es_anonimo' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 1
            ],
            'denunciante_id' => [
                'type' => 'VARCHAR',
                'constraint' => 8,
                'null' => true
            ],
            'motivo_id' => [
                'type' => 'VARCHAR',
                'constraint' => 8,
                'null' => false
            ],
            'motivo_otro' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true
            ],
            'descripcion' => [
                'type' => 'TEXT',
                'null' => false
            ],
            'fecha_incidente' => [
                'type' => 'DATE',
                'null' => true
            ],
            'denunciado_id' => [
                'type' => 'VARCHAR',
                'constraint' => 8,
                'null' => false
            ],
            'dni_admin' => [
                'type' => 'VARCHAR',
                'constraint' => 8,
                'null' => true
            ],
            'fecha_registro' => [
                'type' => 'DATETIME',
                'default' => 'CURRENT_TIMESTAMP'
            ],
            'estado' => [
                'type' => 'ENUM',
                'constraint' => ['registrado', 'recibida', 'en proceso', 'resuelto', 'rechazado'],
                'default' => 'registrado'
            ],
            'pdf_path' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('tracking_code');
        $this->forge->addForeignKey('denunciante_id', 'denunciantes', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('motivo_id', 'motivos', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('denunciado_id', 'denunciados', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('dni_admin', 'administradores', 'dni_admin', 'CASCADE', 'CASCADE');
        $this->forge->createTable('denuncias');

        // Table: motivos
        $this->forge->addField([
            'id' => [
                'type' => 'VARCHAR',
                'constraint' => 8,
                'null' => false
            ],
            'nombre' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false
            ],
            'descripcion' => [
                'type' => 'TEXT',
                'null' => true
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('motivos');

        // Table: seguimiento_denuncias
        $this->forge->addField([
            'id' => [
                'type' => 'VARCHAR',
                'constraint' => 8,
                'null' => false
            ],
            'denuncia_id' => [
                'type' => 'VARCHAR',
                'constraint' => 8,
                'null' => false
            ],
            'estado' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => false
            ],
            'comentario' => [
                'type' => 'TEXT',
                'null' => true
            ],
            'fecha_actualizacion' => [
                'type' => 'DATETIME',
                'default' => 'CURRENT_TIMESTAMP'
            ],
            'dni_admin' => [
                'type' => 'VARCHAR',
                'constraint' => 8,
                'null' => true
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('denuncia_id', 'denuncias', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('dni_admin', 'administradores', 'dni_admin', 'CASCADE', 'CASCADE');
        $this->forge->createTable('seguimiento_denuncias');
    }

    public function down()
    {
        $this->forge->dropTable('seguimiento_denuncias', true);
        $this->forge->dropTable('motivos', true);
        $this->forge->dropTable('denuncias', true);
        $this->forge->dropTable('denunciantes', true);
        $this->forge->dropTable('denunciados', true);
        $this->forge->dropTable('administradores', true);
        $this->forge->dropTable('adjuntos', true);
    }
}
