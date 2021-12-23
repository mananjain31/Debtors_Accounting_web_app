ALTER TABLE ac_item_uom
    ADD CONSTRAINT ac_item_uom_ac_item_fk FOREIGN KEY ( item_code )
        REFERENCES ac_item ( code );