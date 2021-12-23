ALTER TABLE ac_item_tax
    ADD CONSTRAINT ac_item_tax_ac_item_fk FOREIGN KEY ( item_code )
        REFERENCES ac_item ( code );