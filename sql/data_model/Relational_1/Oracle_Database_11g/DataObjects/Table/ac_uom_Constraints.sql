ALTER TABLE ac_uom ADD CONSTRAINT ac_uom_pk PRIMARY KEY ( code );

ALTER TABLE ac_uom ADD CONSTRAINT ac_uom__un UNIQUE ( name );