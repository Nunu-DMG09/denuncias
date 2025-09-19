<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateDenunciasTables extends Migration
{
    public function up()
    {
        /* ============================================= */
        /* BASE DE DATOS GENERALIZADA PARA DENUNCIAS */
        /* ============================================= */

        // Create 'denunciado' table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'nombre' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true
            ],
            'documento' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => true
            ],
            'tipo_documento' => [
                'type' => 'ENUM',
                'constraint' => ['DNI', 'CE', 'RUC'],
                'null' => true
            ],
            'representante_legal' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true
            ],
            'razon_social' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true
            ],
            'direccion' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true
            ],
            'celular' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
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
        $this->forge->createTable('denunciado');
        // Create 'denunciante' table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'nombre' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => false
            ],
            'razon_social' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true
            ],
            'documento' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => false
            ],
            'tipo_documento' => [
                'type' => 'ENUM',
                'constraint' => ['DNI', 'CE', 'RUC'],
                'null' => false
            ],
            'direccion' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true
            ],
            'distrito' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true
            ],
            'provincia' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true
            ],
            'departamento' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true
            ],
            'email' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => false
            ],
            'celular' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => true
            ],
            'telefono' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => true
            ],
            'sexo' => [
                'type' => 'ENUM',
                'constraint' => ['M', 'F'],
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
        $this->forge->addKey('id', true);
        $this->forge->createTable('denunciante');
        // Create 'denuncia' table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'tracking_code' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => false
            ],
            'denunciante_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => true
            ],
            'motivo_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'motivo_otro' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true
            ],
            'es_anonimo' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'null' => false
            ],
            'denunciado_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => true
            ],
            'descripcion' => [
                'type' => 'TEXT',
                'null' => false
            ],
            'estado' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => false
            ],
            'lugar' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true
            ],
            'fecha_incidente' => [
                'type' => 'DATE',
                'null' => false
            ],
            'area' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
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
        $this->forge->addForeignKey('denunciante_id', 'denunciante', 'id', 'NO ACTION', 'SET NULL');
        $this->forge->addForeignKey('denunciado_id', 'denunciado', 'id', 'NO ACTION', 'SET NULL');
        $this->forge->createTable('denuncia');
        // Create 'adjunto' table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'denuncia_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'file_path' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
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
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('denuncia_id', 'denuncia', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->createTable('adjunto');

        // Create 'administrador' table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'nombre' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => false
            ],
            'dni' => [
                'type' => 'VARCHAR',
                'constraint' => '8',
                'null' => false
            ],
            'password' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => false
            ],
            'rol' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => false
            ],
            'estado' => [
                'type' => 'ENUM',
                'constraint' => ['1', '0'],
                'null' => false
            ],
            'area' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
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
        $this->forge->addKey('id', true);
        $this->forge->createTable('administrador');
        // Create historial_admin table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'administrador_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'afectado_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'accion' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => false
            ],
            'motivo' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
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
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('administrador_id', 'administrador', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->addForeignKey('afectado_id', 'administrador', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->createTable('historial_admin');
        // Table: motivo
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
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
        $this->forge->createTable('motivo');

        // Create 'seguimiento_denuncia' table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'denuncia_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'administrador_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'comentario' => [
                'type' => 'TEXT',
                'null' => false
            ],
            'estado' => [
                'type' => "VARCHAR",
                'constraint' => "100",
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
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('denuncia_id', 'denuncia', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->addForeignKey('administrador_id', 'administrador', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->createTable('seguimiento_denuncia');

        // TABLAS ESPECIFICAS PARA DENUNCIAS AMBIENTALES 
        // ambiental_cause
        $this->forge->addField([
            'id' => [
                'type' => 'SMALLINT',
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'type' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => false
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('ambiental_cause');

        // denounce (tabla específica para denuncias ambientales)
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'code' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
                'null' => false
            ],
            'reception_media' => [
                'type' => 'VARCHAR',
                'constraint' => 30,
                'null' => false
            ],
            'date' => [
                'type' => 'DATE',
                'null' => false
            ],
            'has_previous_denounce' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'null' => false,
                'default' => 0
            ],
            'has_response' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'null' => false,
                'default' => 0
            ],
            'directed_entity' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => false
            ],
            'entity_response' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => false
            ],
            'comunication_media' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => false
            ],
            'source' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => false
            ],
            'keep_identity' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'null' => false,
                'default' => 0
            ],
            'address' => [
                'type' => 'VARCHAR',
                'constraint' => 250,
                'null' => false
            ],
            'reference' => [
                'type' => 'VARCHAR',
                'constraint' => 250,
                'null' => false
            ],
            'facts_description' => [
                'type' => 'TEXT',
                'null' => false
            ],
            'ambiental_promise' => [
                'type' => 'VARCHAR',
                'constraint' => 15,
                'null' => false
            ],
            'proof_description' => [
                'type' => 'TEXT',
                'null' => true
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('denounce');

        // denounce_status
        $this->forge->addField([
            'id' => [
                'type' => 'SMALLINT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'type' => [
                'type' => 'VARCHAR',
                'constraint' => 25,
                'null' => false
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('denounce_status');

        // denounce_action
        $this->forge->addField([
            'id' => [
                'type' => 'BIGINT',
                'constraint' => 20,
                'unsigned' => true,
                'auto_increment' => true
            ],
            'id_denounce' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'id_denounce_status' => [
                'type' => 'SMALLINT',
                'unsigned' => true,
                'null' => false
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => false
            ],
            'date' => [
                'type' => 'TIMESTAMP',
                'default' => new \CodeIgniter\Database\RawSql('CURRENT_TIMESTAMP')
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('id_denounce');
        $this->forge->addKey('id_denounce_status');
        $this->forge->addForeignKey('id_denounce', 'denounce', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->addForeignKey('id_denounce_status', 'denounce_status', 'id', 'NO ACTION', 'NO ACTION');
        $this->forge->createTable('denounce_action');

        // denounce_ambiental_cause (relación many-to-many)
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'id_ambiental_cause' => [
                'type' => 'SMALLINT',
                'unsigned' => true,
                'null' => false
            ],
            'id_denounce' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('id_ambiental_cause', 'ambiental_cause', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->addForeignKey('id_denounce', 'denounce', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->createTable('denounce_ambiental_cause');

        // document_type
        $this->forge->addField([
            'id' => [
                'type' => 'SMALLINT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'type' => [
                'type' => 'VARCHAR',
                'constraint' => 15,
                'null' => false
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('document_type');

        // person
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'id_doc_type' => [
                'type' => 'SMALLINT',
                'unsigned' => true,
                'null' => false
            ],
            'is_natural_person' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'null' => false
            ],
            'doc_number' => [
                'type' => 'VARCHAR',
                'constraint' => 11,
                'null' => false,
                'default' => 'NO TIENE'
            ],
            'trade_name' => [
                'type' => 'VARCHAR',
                'constraint' => 150,
                'null' => false
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => 45,
                'null' => false
            ],
            'paternal_surname' => [
                'type' => 'VARCHAR',
                'constraint' => 45,
                'null' => false
            ],
            'mother_surname' => [
                'type' => 'VARCHAR',
                'constraint' => 45,
                'null' => false
            ],
            'legal_representator' => [
                'type' => 'VARCHAR',
                'constraint' => 250,
                'null' => false,
                'default' => 'NO ESPECIFICA'
            ],
            'address' => [
                'type' => 'VARCHAR',
                'constraint' => 250,
                'null' => false
            ],
            'fixed_phone' => [
                'type' => 'VARCHAR',
                'constraint' => 10,
                'null' => false,
                'default' => 'NO TIENE'
            ],
            'first_phone' => [
                'type' => 'CHAR',
                'constraint' => 9,
                'null' => false,
                'default' => 'NO TIENE'
            ],
            'second_phone' => [
                'type' => 'CHAR',
                'constraint' => 9,
                'null' => false,
                'default' => 'NO TIENE'
            ],
            'email' => [
                'type' => 'VARCHAR',
                'constraint' => 150,
                'null' => false,
                'default' => 'NO TIENE'
            ],
            'departament' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => false
            ],
            'province' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => false
            ],
            'distric' => [
                'type' => 'VARCHAR',
                'constraint' => 45,
                'null' => false,
                'default' => 'JOSÉ LEONARDO ORTIZ'
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('id_doc_type');
        $this->forge->addForeignKey('id_doc_type', 'document_type', 'id', 'NO ACTION', 'NO ACTION');
        $this->forge->createTable('person');

        // person_denounce (relación entre person y denounce)
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'id_person' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'id_denounce' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'is_affected' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'null' => false
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('id_person', 'person', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->addForeignKey('id_denounce', 'denounce', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->createTable('person_denounce');

        // proof
        $this->forge->addField([
            'id' => [
                'type' => 'BIGINT',
                'constraint' => 20,
                'unsigned' => true,
                'auto_increment' => true
            ],
            'id_denounce' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'path' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => false
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('id_denounce', 'denounce', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->createTable('proof');

        // user (tabla simple para usuarios del sistema ambiental)
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => false
            ],
            'paternal_surname' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => false
            ],
            'mother_surname' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => false
            ],
            'email' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => false
            ],
            'password' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('user');
    }

    public function down()
    {
        // Drop ambiental-specific children first to avoid FK constraint errors
        $this->forge->dropTable('denounce_action', true);
        $this->forge->dropTable('denounce_ambiental_cause', true);
        $this->forge->dropTable('person_denounce', true);
        $this->forge->dropTable('proof', true);
        $this->forge->dropTable('person', true);
        // Then ambiental parents
        $this->forge->dropTable('denounce', true);
        $this->forge->dropTable('ambiental_cause', true);
        $this->forge->dropTable('denounce_status', true);
        $this->forge->dropTable('document_type', true);
        $this->forge->dropTable('user', true);

        // Drop generic children first to avoid FK constraint errors
        $this->forge->dropTable('seguimiento_denuncia', true);
        $this->forge->dropTable('adjunto', true);
        $this->forge->dropTable('denuncia', true);
        // Then parents
        $this->forge->dropTable('denunciado', true);
        $this->forge->dropTable('denunciante', true);
        $this->forge->dropTable('administrador', true);
        $this->forge->dropTable('motivo', true);
    }
}
