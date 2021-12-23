ALTER TABLE ac_item_uom
    ADD CONSTRAINT ac_item_uom_ac_uom_fk FOREIGN KEY ( uom_code )
        REFERENCES ac_uom ( code );